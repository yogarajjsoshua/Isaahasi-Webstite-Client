import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';

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

  // Subscription's first charge is verified. The webhook handler remains
  // the source of truth for persistence (subscription.activated/.charged),
  // since it is keyed on Razorpay-issued IDs and immune to client retries.

  return Response.json({ verified: true, subscriptionId: razorpay_subscription_id });
}
