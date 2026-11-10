import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';
import { processLiveSubscriptions } from '../_lib/subscriptionReceipts.js';

interface VerifySubscriptionBody {
  razorpay_subscription_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as VerifySubscriptionBody;
  const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ error: 'Missing verification fields' }, { status: 400 });
  }

  const isValid = validatePaymentVerification(
    { subscription_id: razorpay_subscription_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET!,
  );

  if (!isValid) {
    console.error('verify-subscription: signature mismatch', {
      razorpay_subscription_id,
      razorpay_payment_id,
    });
    return Response.json({ error: 'Subscription verification failed' }, { status: 400 });
  }

  // Subscription's first charge is verified. Send its receipt right away
  // instead of waiting for the daily cron. This may overlap with the cron; the
  // receipt-id cell and the Resend idempotency key keep it to one email.
  // Best-effort: the payment is already real, so nothing here may fail the
  // response — the cron retries anything missed.
  try {
    await processLiveSubscriptions({
      deadlineMs: Date.now() + 20_000,
      onlySubscriptionId: razorpay_subscription_id,
    });
  } catch (err) {
    console.error('verify-subscription: instant receipt failed', razorpay_subscription_id, err);
  }

  return Response.json({ verified: true, subscriptionId: razorpay_subscription_id });
}
