import { processLiveSubscriptions } from '../_lib/subscriptionReceipts.js';

// Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically once
// CRON_SECRET is set in the project. Fail closed if it is missing.
const TIME_BUDGET_MS = 50_000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await processLiveSubscriptions({ deadlineMs: Date.now() + TIME_BUDGET_MS });
    return Response.json(summary);
  } catch (err) {
    console.error('cron/send-subscription-receipts failed', err);
    return Response.json({ error: 'Cron run failed' }, { status: 500 });
  }
}
