import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CreateSubscriptionBody {
  amount: number;
  donor: {
    fullName: string;
    email: string;
    mobileNumber: string;
    address?: string;
    nationality?: string;
    panNumber?: string;
  };
  type: 'monthly';
}

// Razorpay plans are immutable and cannot be deleted, so a plan is created
// per unique amount, never per donation. There is no persistence layer yet
// (Google Sheets "Plans" tab, per the implementation guide) to cache plan
// IDs across invocations, so this currently creates one plan per donation —
// wire up the cache lookup here once that store exists.
async function findOrCreatePlan(amountInPaise: number): Promise<string> {
  const plan = await razorpay.plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: `Monthly donation – ₹${amountInPaise / 100}`,
      amount: amountInPaise,
      currency: 'INR',
    },
  });

  return plan.id;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateSubscriptionBody;
  const { amount, donor, type } = body;

  if (type !== 'monthly') {
    return Response.json({ error: 'Invalid donation type for this endpoint' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < 1) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (!donor?.fullName || !donor?.email || !donor?.mobileNumber) {
    return Response.json({ error: 'Missing donor details' }, { status: 400 });
  }

  try {
    const planId = await findOrCreatePlan(Math.round(amount * 100));

    // Razorpay subscriptions require a finite total_count; 120 monthly
    // cycles (10 years) is used as the "until the donor cancels" convention.
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120,
      notes: {
        donor_name: donor.fullName,
        donor_email: donor.email,
        donor_mobile: donor.mobileNumber,
        donor_address: donor.address ?? '',
        donor_nationality: donor.nationality ?? '',
        donor_pan: donor.panNumber ?? '',
        donation_type: 'monthly',
      },
    });

    return Response.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('create-subscription failed', err);
    return Response.json({ error: 'Could not create subscription' }, { status: 502 });
  }
}
