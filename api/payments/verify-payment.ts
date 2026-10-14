import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';
import { buildAndSaveReceipt } from '../receipts/generate';

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  // Donor/payment context collected on the donation form, threaded through
  // from paymentService.verifyOnce so a receipt can be generated below.
  // All optional + defaulted so a missing field never fails verification.
  donorName?: string;
  donorEmail?: string;
  amount?: number;
  purpose?: string;
  paymentMethod?: string;
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

  // Best-effort receipt generation. The payment is already verified and
  // real at this point, so a PDF failure (e.g. missing template assets)
  // must never fail this response — it's just logged.
  let receiptPath: string | null = null;
  try {
    const result = await buildAndSaveReceipt({
      donorName: body.donorName ?? 'Donor',
      amount: typeof body.amount === 'number' && Number.isFinite(body.amount) ? body.amount : 0,
      purpose: body.purpose ?? 'Donation',
      paymentId: razorpay_payment_id,
      paymentMethod: body.paymentMethod ?? 'Online (Razorpay)',
    });
    receiptPath = result.path;
  } catch (err) {
    console.error('verify-payment: receipt generation failed', razorpay_payment_id, err);
  }

  return Response.json({ verified: true, paymentId: razorpay_payment_id, receiptPath });
}
