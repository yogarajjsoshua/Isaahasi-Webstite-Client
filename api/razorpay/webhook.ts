import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js';

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: { entity: Record<string, unknown> & { id: string } };
    subscription?: { entity: Record<string, unknown> & { id: string } };
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

  // Record-keeping (e.g. the Google Sheets "Payments" tab, per
  // RazorPay_Implementation.md §8) is not yet wired up. Each case below is
  // the point where that write would happen, keyed on the Razorpay-issued
  // id (payment.entity.id / subscription.entity.id) for idempotency, since
  // Razorpay redelivers webhooks on timeout/non-2xx.
  switch (event.event) {
    case 'payment.captured': {
      const payment = event.payload.payment?.entity;
      console.log('webhook: payment captured', payment?.id);
      break;
    }
    case 'payment.failed': {
      const payment = event.payload.payment?.entity;
      console.log('webhook: payment failed', payment?.id);
      break;
    }
    case 'subscription.activated': {
      const subscription = event.payload.subscription?.entity;
      console.log('webhook: subscription activated', subscription?.id);
      break;
    }
    case 'subscription.charged': {
      const payment = event.payload.payment?.entity;
      const subscription = event.payload.subscription?.entity;
      console.log('webhook: subscription charged', subscription?.id, payment?.id);
      break;
    }
    case 'subscription.halted':
    case 'subscription.cancelled':
    case 'subscription.pending':
    case 'subscription.paused': {
      const subscription = event.payload.subscription?.entity;
      console.log(`webhook: ${event.event}`, subscription?.id);
      break;
    }
    default:
      console.log('webhook: unhandled event', event.event);
  }

  // Always ack quickly with 2xx once the signature is verified, regardless
  // of event type, so Razorpay does not retry/redeliver.
  return Response.json({ received: true });
}
