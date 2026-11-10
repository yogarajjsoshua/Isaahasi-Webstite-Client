import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';
import { appendFormRow } from '../_lib/sheets.js';
import {
  PAYMENTS_SHEET_NAME,
  buildPaymentsRow,
  recordPaymentRow,
  type RazorpayNotes,
} from '../_lib/paymentsSheet.js';
import { buildAndSaveReceipt } from '../receipts/generate.js';
import { sendReceiptEmail } from '../_lib/email.js';

const SHEET_NAME = PAYMENTS_SHEET_NAME;

interface RazorpayPaymentEntity {
  id: string;
  order_id?: string;
  amount?: number;
  currency?: string;
  email?: string;
  contact?: string;
  notes?: RazorpayNotes;
}

interface RazorpaySubscriptionEntity {
  id: string;
  notes?: RazorpayNotes;
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: { entity: RazorpayPaymentEntity };
    subscription?: { entity: RazorpaySubscriptionEntity };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 400 });
  }

  const isValid = validateWebhookSignature(
    rawBody,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET!,
  );

  if (!isValid) {
    console.error('webhook: signature mismatch');
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as RazorpayWebhookEvent;

  // Sheets failures must never fail this response — Razorpay would retry the
  // whole webhook indefinitely, and the payment itself already happened
  // regardless of whether record-keeping succeeds.
  try {
    switch (event.event) {
      case 'payment.captured':
      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (payment) {
          const row = buildPaymentsRow({
            recordId: payment.id,
            donationType: 'once',
            amountInPaise: payment.amount ?? null,
            currency: payment.currency ?? 'INR',
            orderId: payment.order_id ?? '',
            paymentId: payment.id,
            subscriptionId: '',
            status: event.event === 'payment.captured' ? 'captured' : 'failed',
            notes: payment.notes,
            fallbackEmail: payment.email,
            fallbackMobile: payment.contact,
          });
          await recordPaymentRow(row, payment.id);
        }
        break;
      }
      case 'subscription.charged': {
        const payment = event.payload.payment?.entity;
        const subscription = event.payload.subscription?.entity;
        if (payment) {
          const row = buildPaymentsRow({
            recordId: payment.id,
            donationType: 'monthly',
            amountInPaise: payment.amount ?? null,
            currency: payment.currency ?? 'INR',
            orderId: payment.order_id ?? '',
            paymentId: payment.id,
            subscriptionId: subscription?.id ?? '',
            status: 'charged',
            notes: payment.notes ?? subscription?.notes,
            fallbackEmail: payment.email,
            fallbackMobile: payment.contact,
          });
          await recordPaymentRow(row, payment.id);
        }
        break;
      }
      case 'subscription.activated':
      case 'subscription.halted':
      case 'subscription.cancelled':
      case 'subscription.pending':
      case 'subscription.paused': {
        const subscription = event.payload.subscription?.entity;
        if (subscription) {
          const row = buildPaymentsRow({
            recordId: subscription.id,
            donationType: 'monthly',
            amountInPaise: null,
            currency: 'INR',
            orderId: '',
            paymentId: '',
            subscriptionId: subscription.id,
            status: event.event,
            notes: subscription.notes,
          });
          await appendFormRow(SHEET_NAME, row);
        }
        break;
      }
      default:
        console.log('webhook: unhandled event', event.event);
    }
  } catch (err) {
    console.error('webhook: Sheets write failed', event.event, err);
  }

  // Always ack quickly with 2xx once the signature is verified, regardless
  // of event type, so Razorpay does not retry/redeliver.
  return Response.json({ received: true });
}
