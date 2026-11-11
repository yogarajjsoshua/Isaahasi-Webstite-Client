import Razorpay from 'razorpay';
import { isValidAmount, validateDonor } from '../_lib/validation.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CreateOrderBody {
  amount: number;
  donor: {
    fullName: string;
    email: string;
    mobileNumber: string;
    address?: string;
    nationality?: string;
    panNumber?: string;
  };
  type: 'once';
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateOrderBody;
  const { amount, donor, type } = body;

  if (type !== 'once') {
    return Response.json({ error: 'Invalid donation type for this endpoint' }, { status: 400 });
  }
  if (!isValidAmount(amount)) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }
  const donorError = validateDonor(donor);
  if (donorError) {
    return Response.json({ error: donorError }, { status: 400 });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      notes: {
        donor_name: donor.fullName,
        donor_email: donor.email,
        donor_mobile: donor.mobileNumber,
        donor_address: donor.address ?? '',
        donor_nationality: donor.nationality ?? '',
        donor_pan: donor.panNumber ?? '',
        donation_type: 'once',
      },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('create-order failed', err);
    return Response.json({ error: 'Could not create order' }, { status: 502 });
  }
}
