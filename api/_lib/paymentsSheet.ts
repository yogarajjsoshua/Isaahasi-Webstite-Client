import { appendFormRow, columnContainsValue } from './sheets.js';

// Payments tab column order, per RazorPay_Implementation.md §8 — appendFormRow
// takes row values in object key-insertion order, so this must match exactly:
// Payment Record ID, Timestamp, Submission ID, Donor Name, Email, Mobile,
// Donation Type, Amount, Currency, Razorpay Order ID, Razorpay Payment ID,
// Razorpay Subscription ID, Payment Status.
const SHEET_NAME = 'Payments';
const PAYMENT_ID_COLUMN = 'K'; // "Razorpay Payment ID" is the 11th column.

export interface RazorpayNotes {
  donor_name?: string;
  donor_email?: string;
  donor_mobile?: string;
  donation_type?: string;
}

export function buildPaymentsRow(options: {
  recordId: string;
  donationType: string;
  amountInPaise: number | null;
  currency: string;
  orderId: string;
  paymentId: string;
  subscriptionId: string;
  status: string;
  notes?: RazorpayNotes;
  fallbackEmail?: string;
  fallbackMobile?: string;
}): Record<string, string> {
  const notes = options.notes ?? {};

  return {
    'Payment Record ID': options.recordId,
    Timestamp: new Date().toISOString(),
    'Submission ID': '',
    'Donor Name': notes.donor_name ?? 'Donor',
    Email: notes.donor_email ?? options.fallbackEmail ?? '',
    Mobile: notes.donor_mobile ?? options.fallbackMobile ?? '',
    'Donation Type': notes.donation_type ?? options.donationType,
    Amount: options.amountInPaise != null ? String(options.amountInPaise / 100) : '',
    Currency: options.currency,
    'Razorpay Order ID': options.orderId,
    'Razorpay Payment ID': options.paymentId,
    'Razorpay Subscription ID': options.subscriptionId,
    'Payment Status': options.status,
  };
}

// Razorpay redelivers an event on timeout/non-2xx (§7.3), so a payment- or
// charge-keyed row is only appended once per Razorpay-issued payment id.
// Pure subscription-status events (activated/halted/...) have no payment id
// to key on and are appended unconditionally — redelivery of those is rare
// and, unlike a payment row, a repeated status line is not a donation record.
export async function recordPaymentRow(row: Record<string, string>, paymentId: string): Promise<void> {
  const alreadyRecorded = await columnContainsValue(SHEET_NAME, PAYMENT_ID_COLUMN, paymentId);
  if (alreadyRecorded) {
    console.log('payments sheet: skipping duplicate for payment', paymentId);
    return;
  }
  await appendFormRow(SHEET_NAME, row);
}

export { SHEET_NAME as PAYMENTS_SHEET_NAME };
