import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as VerifyPaymentBody;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ error: 'Missing verification fields' }, { status: 400 });
  }

  const isValid = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET!,
  );

  if (!isValid) {
    console.error('verify-payment: signature mismatch', { razorpay_order_id, razorpay_payment_id });
    return Response.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  // Payment is verified. Record-keeping (e.g. the Google Sheets "Payments"
  // tab) is not yet wired up — see RazorPay_Implementation.md §8. The
  // webhook handler is the source of truth for persistence either way,
  // since it is keyed on razorpay_payment_id and immune to client retries.

  return Response.json({ verified: true, paymentId: razorpay_payment_id });
}
