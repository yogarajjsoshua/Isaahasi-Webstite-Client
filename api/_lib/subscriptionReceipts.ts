import Razorpay from 'razorpay';
import { deleteRows, getCell, getRows, updateCell, appendFormRow, type SheetRow } from './sheets.js';
import { buildPaymentsRow, recordPaymentRow, type RazorpayNotes } from './paymentsSheet.js';
import { sendReceiptEmail } from './email.js';
import { buildAndSaveReceipt } from '../receipts/generate.js';

export const LIVE_SUBSCRIPTIONS_SHEET = 'Live Subscriptions';

// Live Subscriptions columns (header row 1):
// A Subscription ID | B Donor Name | C Email | D Mobile | E Amount (INR) |
// F Razorpay Status | G Receipt Payment IDs | H Created At | I Last Checked
const COL_STATUS = 'F';
const COL_RECEIPT_IDS = 'G';
const COL_LAST_CHECKED = 'I';

const REMOVE_STATUSES = new Set(['cancelled', 'completed', 'expired']);
const STALE_CREATED_MS = 2 * 24 * 60 * 60 * 1000;
const CONCURRENCY = 5;

export interface LiveSubscriptionInput {
  subscriptionId: string;
  donorName: string;
  email: string;
  mobile: string;
  amount: number;
}

export interface ProcessSummary {
  processed: number;
  receiptsSent: number;
  skippedAlreadySent: number;
  removed: number;
  failed: number;
}

interface InvoiceLike {
  status?: string;
  payment_id?: string | null;
  paid_at?: number | null;
  order_id?: string | null;
  amount_paid?: number | null;
  currency?: string | null;
}

function getRazorpay(): Razorpay {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

function parseIds(cell: string | undefined): string[] {
  return (cell ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Adds `paymentId` to the row's "Receipt Payment IDs" cell. Set-based: the
 * live cell is re-read right before writing and an id that is already there
 * is never written again, so the cell can never hold duplicates. Retries with
 * short backoff because this runs right after the email went out.
 */
export async function appendReceiptId(rowNumber: number, paymentId: string): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ids = parseIds(await getCell(LIVE_SUBSCRIPTIONS_SHEET, rowNumber, COL_RECEIPT_IDS));
      if (ids.includes(paymentId)) {
        return;
      }
      ids.push(paymentId);
      await updateCell(LIVE_SUBSCRIPTIONS_SHEET, rowNumber, COL_RECEIPT_IDS, ids.join(', '));
      return;
    } catch (err) {
      lastError = err;
      await sleep(300 * (attempt + 1));
    }
  }
  throw lastError;
}

/**
 * Appends a `created` row for a freshly created subscription. Safe to call
 * twice: a subscription id that already has a row is not added again.
 */
export async function addLiveSubscriptionRow(input: LiveSubscriptionInput): Promise<void> {
  const rows = await getRows(LIVE_SUBSCRIPTIONS_SHEET);
  if (rows.some((r) => r.values[0] === input.subscriptionId)) {
    return;
  }
  await appendFormRow(LIVE_SUBSCRIPTIONS_SHEET, {
    'Subscription ID': input.subscriptionId,
    'Donor Name': input.donorName,
    Email: input.email,
    Mobile: input.mobile,
    'Amount (INR)': String(input.amount),
    'Razorpay Status': 'created',
    'Receipt Payment IDs': '',
    'Created At': new Date().toISOString(),
    'Last Checked': '',
  });
}

interface RowOutcome {
  receiptsSent: number;
  skippedAlreadySent: number;
  failed: boolean;
  remove: boolean;
}

async function processRow(
  razorpay: Razorpay,
  row: SheetRow,
  deadlineMs: number,
): Promise<RowOutcome> {
  const outcome: RowOutcome = { receiptsSent: 0, skippedAlreadySent: 0, failed: false, remove: false };
  const subscriptionId = row.values[0];

  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    const status = String(subscription.status);
    const notes = (subscription.notes ?? {}) as RazorpayNotes;

    const invoiceList = await razorpay.invoices.all({ subscription_id: subscriptionId, count: 100 } as never);
    const paid = (invoiceList.items as unknown as InvoiceLike[])
      .filter((inv) => inv.status === 'paid' && inv.payment_id)
      .sort((a, b) => (a.paid_at ?? 0) - (b.paid_at ?? 0));

    const sentIds = new Set(parseIds(row.values[6]));
    const donorName = row.values[1] || notes.donor_name || 'Donor';
    const email = row.values[2] || notes.donor_email || '';
    const mobile = row.values[3] || notes.donor_mobile || '';
    const rowAmount = Number(row.values[4]);

    for (let i = 0; i < paid.length; i++) {
      const invoice = paid[i];
      const paymentId = invoice.payment_id as string;

      if (sentIds.has(paymentId)) {
        outcome.skippedAlreadySent++;
        continue;
      }
      if (Date.now() > deadlineMs) {
        // Out of time budget: leave remaining charges for the next run.
        outcome.failed = true;
        return outcome;
      }
      if (!email) {
        console.error('subscriptionReceipts: no donor email for', subscriptionId);
        outcome.failed = true;
        return outcome;
      }

      const amount =
        invoice.amount_paid != null && invoice.amount_paid > 0
          ? invoice.amount_paid / 100
          : Number.isFinite(rowAmount)
            ? rowAmount
            : 0;
      const installmentNumber = i + 1;

      const receipt = await buildAndSaveReceipt({
        donorName,
        amount,
        purpose: 'Monthly Donation',
        paymentId,
        paymentMethod: 'Online (Razorpay)',
      });

      const sendResult = await sendReceiptEmail({
        to: email,
        donorName,
        receiptNo: receipt.receiptNo,
        amount,
        pdfBytes: receipt.pdfBytes,
        donationType: 'monthly',
        installmentNumber,
        idempotencyKey: `monthly-receipt/${paymentId}`,
      });

      if (sendResult === 'in-flight') {
        // Another run is sending this exact receipt; it will record the id.
        outcome.skippedAlreadySent++;
        continue;
      }
      if (sendResult === 'sent') {
        outcome.receiptsSent++;
      } else {
        outcome.skippedAlreadySent++;
      }

      await appendReceiptId(row.rowNumber, paymentId);
      sentIds.add(paymentId);

      try {
        await recordPaymentRow(
          buildPaymentsRow({
            recordId: paymentId,
            donationType: 'monthly',
            amountInPaise: Math.round(amount * 100),
            currency: invoice.currency ?? 'INR',
            orderId: invoice.order_id ?? '',
            paymentId,
            subscriptionId,
            status: 'charged',
            notes,
            fallbackEmail: email,
            fallbackMobile: mobile,
          }),
          paymentId,
        );
      } catch (err) {
        console.error('subscriptionReceipts: Payments row write failed', paymentId, err);
      }
    }

    const createdAt = Date.parse(row.values[7] ?? '');
    const staleCreated =
      status === 'created' && Number.isFinite(createdAt) && Date.now() - createdAt > STALE_CREATED_MS;
    outcome.remove = REMOVE_STATUSES.has(status) || staleCreated;

    if (!outcome.remove) {
      await updateCell(LIVE_SUBSCRIPTIONS_SHEET, row.rowNumber, COL_STATUS, status);
      await updateCell(LIVE_SUBSCRIPTIONS_SHEET, row.rowNumber, COL_LAST_CHECKED, new Date().toISOString());
    }
  } catch (err) {
    console.error('subscriptionReceipts: failed for', subscriptionId, err);
    outcome.failed = true;
    outcome.remove = false;
  }

  return outcome;
}

/**
 * Merges rows that share a Subscription ID into the first one (union of
 * receipt ids) and returns the unique rows plus the row numbers of extras.
 * Runs before any email is sent so a duplicate row can't cause a double send.
 */
async function mergeDuplicateRows(rows: SheetRow[]): Promise<{ unique: SheetRow[]; extras: number[] }> {
  const byId = new Map<string, SheetRow>();
  const extras: number[] = [];

  for (const row of rows) {
    const id = row.values[0];
    if (!id) continue;

    const first = byId.get(id);
    if (!first) {
      byId.set(id, { rowNumber: row.rowNumber, values: [...row.values] });
      continue;
    }

    const merged = [...new Set([...parseIds(first.values[6]), ...parseIds(row.values[6])])];
    first.values[6] = merged.join(', ');
    extras.push(row.rowNumber);
  }

  for (const row of byId.values()) {
    const original = rows.find((r) => r.rowNumber === row.rowNumber);
    if (original && original.values[6] !== row.values[6]) {
      await updateCell(LIVE_SUBSCRIPTIONS_SHEET, row.rowNumber, COL_RECEIPT_IDS, row.values[6]);
    }
  }

  return { unique: [...byId.values()], extras };
}

export async function processLiveSubscriptions(options: {
  deadlineMs: number;
  /** Restrict the run to a single subscription (used for the instant first receipt). */
  onlySubscriptionId?: string;
}): Promise<ProcessSummary> {
  const summary: ProcessSummary = {
    processed: 0,
    receiptsSent: 0,
    skippedAlreadySent: 0,
    removed: 0,
    failed: 0,
  };

  const allRows = await getRows(LIVE_SUBSCRIPTIONS_SHEET);
  const { unique, extras } = await mergeDuplicateRows(allRows);
  const toDelete = [...extras];

  const targets = options.onlySubscriptionId
    ? unique.filter((r) => r.values[0] === options.onlySubscriptionId)
    : unique;

  const razorpay = getRazorpay();
  const queue = [...targets];

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      if (Date.now() > options.deadlineMs) return;
      const row = queue.shift()!;
      const outcome = await processRow(razorpay, row, options.deadlineMs);

      summary.processed++;
      summary.receiptsSent += outcome.receiptsSent;
      summary.skippedAlreadySent += outcome.skippedAlreadySent;
      if (outcome.failed) summary.failed++;
      if (outcome.remove && !outcome.failed) toDelete.push(row.rowNumber);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length) }, () => worker()));

  await deleteRows(LIVE_SUBSCRIPTIONS_SHEET, toDelete);
  summary.removed = toDelete.length;

  return summary;
}
