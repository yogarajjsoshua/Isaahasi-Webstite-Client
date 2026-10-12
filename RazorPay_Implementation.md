# Razorpay Integration Guide — Isaahasi Donations

This document is a from-scratch, verified integration guide for adding Razorpay
payments to this Vite + React app, deployed as Vercel Serverless Functions. It
covers **one-time donations** and **recurring (subscription) donations**,
server-side verification, and webhooks.

> **Verified against current Razorpay docs** (razorpay.com/docs and the
> official `razorpay-node` SDK repo) as of October 2026. No endpoint or
> parameter below is guessed — where the official docs did not expose a
> specific low-level detail (e.g. the exact manual HMAC string for
> subscriptions), this guide tells you to use the SDK helper instead of
> hand-rolling it, so you're never relying on an unverified formula.

> **Current repo state (checked before writing this guide):** there is no
> `api/`, `lib/`, or `vercel.json` in `isaahasi-frontend/` yet, and no
> Google Sheets module exists. The Stage 3 planning doc assumes Stage 2
> (Google Sheets) is already done — it isn't. Every Google Sheets step below
> is marked **optional / not yet built** so you can integrate Razorpay now and
> wire up Sheets later without this guide lying to you.

---

## 1. Architecture

```
React (Vite)                     Vercel Serverless Functions           Razorpay
─────────────                     ─────────────────────────             ────────
DonateModal
   │  POST amount+donor+type
   ▼
                         api/payments/create-order.ts   ───▶  Orders API (one-time)
                         api/payments/create-subscription.ts ▶ Plans + Subscriptions API (recurring)
   │  open Razorpay Checkout (checkout.js)
   ▼
Razorpay Checkout modal  ◀──────────────────────────────────  Razorpay hosted UI
   │  on success: order_id/subscription_id + payment_id + signature
   ▼
                         api/payments/verify-payment.ts  ───▶  HMAC-SHA256 verification
   │
   ▼
Success / Failure UI

                         api/razorpay/webhook.ts  ◀──────────  Razorpay server → server event push
                                   │
                                   ▼
                         (optional) lib/googleSheets.ts — Payments tab
```

Two independent confirmation paths exist on purpose:

1. **Synchronous verification** (`verify-payment.ts`) — runs right after
   Checkout closes, gives the browser instant feedback.
2. **Webhook** (`webhook.ts`) — the only source of truth for recurring
   charges, delayed/async payment methods (UPI, netbanking), and anything
   that happens when the browser isn't there to call back (card auto-debit
   for a subscription's 2nd, 3rd, ... cycle).

**Never mark a donation successful from browser JS alone.** The Checkout
`handler` callback firing is not proof of payment — only a verified signature
(step 4) or a webhook event (step 6) is.

---

## 2. Prerequisites

1. Razorpay account → **Test Mode** keys from Dashboard → Settings → API Keys.
2. Install the server SDK (used only inside `api/*.ts`, never bundled into the
   frontend):
   ```bash
   npm install razorpay
   ```
3. The frontend loads Razorpay's hosted Checkout script at runtime — no npm
   package for that:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

---

## 3. Environment variables

| Variable | Where | Exposed to browser? |
|---|---|---|
| `RAZORPAY_KEY_ID` | Vercel env (Server) | No — read it server-side and return it in the create-order/create-subscription response instead |
| `RAZORPAY_KEY_SECRET` | Vercel env (Server) | **Never** |
| `RAZORPAY_WEBHOOK_SECRET` | Vercel env (Server) | **Never** |
| `VITE_RAZORPAY_KEY_ID` | Vercel env (Server+Build) | Yes, intentionally — Vite inlines `VITE_*` vars into the client bundle |

Set these in Vercel: Project → Settings → Environment Variables (separately
for Production and Preview/Test if you use different Razorpay accounts for
each). For local dev, create `isaahasi-frontend/.env.local` (already covered
by `.gitignore` — confirm `.env*` is listed; add it if not):

```bash
# .env.local
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

`VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID` are the *same value* — the
`VITE_` copy exists only so Vite will inline it into the frontend build.
The Key ID is public by design (it identifies your account to Checkout; it
cannot authorize a charge by itself). The Key **Secret** and the **Webhook
Secret** sign/verify requests and must stay server-only.

Run `npx vercel env pull isaahasi-frontend/.env.local` after setting them in
the Vercel dashboard to sync them locally.

---

## 4. Vercel function conventions used in this guide

This project has no `api/` directory yet. Vercel auto-detects any file under
`api/` as a serverless function with zero config. This guide uses Vercel's
current **Web Standard handler** format (`export function POST(request: Request)`)
rather than the older `(req, res)` style, for one concrete reason: the
webhook handler needs the **raw, unparsed request body** to compute the HMAC
signature, and the Web Standard `Request` object gives you `await request.text()`
directly. The older Vercel helper auto-parses JSON into `request.body` as soon
as it's accessed, which is the wrong body for signature verification unless
you're careful to never touch `.body` first.

Each file below is placed at `isaahasi-frontend/api/...` so it deploys
alongside the Vite app in the same Vercel project.

---

## 5. One-time donations

### 5.1 Create Order — `api/payments/create-order.ts`

Razorpay Orders API: `POST https://api.razorpay.com/v1/orders`. An Order is a
required precursor to any one-time Checkout payment — Checkout cannot be
opened with a bare amount, it needs an `order_id`.

```ts
// api/payments/create-order.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, donor, type } = body as {
    amount: number;
    donor: { fullName: string; email: string; mobileNumber: string };
    type: 'once';
  };

  if (type !== 'once') {
    return Response.json({ error: 'Invalid donation type for this endpoint' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount < 1) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (!donor?.fullName || !donor?.email || !donor?.mobileNumber) {
    return Response.json({ error: 'Missing donor details' }, { status: 400 });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in the smallest currency unit (paise for INR)
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      notes: {
        donor_name: donor.fullName,
        donor_email: donor.email,
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
```

Notes:
- `amount` to Razorpay is **always in the smallest currency unit** (paise
  for INR, i.e. ₹1 = `100`). This is a documented, fixed Razorpay API
  requirement.
- `receipt` is your own reference string (max 40 chars), useful for
  reconciling later; it does not have to be a real receipt number yet.
- Only `orderId`, `amount`, `currency`, and the **public** `keyId` go back to
  the browser. `RAZORPAY_KEY_SECRET` never leaves this function.

### 5.2 Frontend: open Checkout for a one-time order

Load the Checkout script once (e.g. in `index.html`, or dynamically on modal
open) and call it from `DonateModal.tsx` / `paymentService.ts`:

```ts
// src/services/paymentService.ts (one-time path)
async function payOnce(amount: number, donor: DonorInfo): Promise<RazorpayResult> {
  const res = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, donor, type: 'once' }),
  });
  if (!res.ok) throw new Error('Could not start payment');
  const order = await res.json();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Isaahasi',
      description: 'One-time donation',
      prefill: {
        name: donor.fullName,
        email: donor.email,
        contact: donor.mobileNumber,
      },
      handler: (response: RazorpayCheckoutResponse) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('cancelled')),
      },
    });
    rzp.open();
  });
}
```

`window.Razorpay` is provided by the `checkout.js` script tag — add a
`declare global { interface Window { Razorpay: any } }` or a small `.d.ts` to
satisfy TypeScript, since Razorpay doesn't ship first-party types.

### 5.3 Verify Payment — `api/payments/verify-payment.ts`

After Checkout's `handler` fires, you receive `razorpay_order_id`,
`razorpay_payment_id`, and `razorpay_signature` in the browser. Send all
three to the server; **do not** treat the handler firing as success until
this call returns ok.

Razorpay's documented formula for order-based payments:
`signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)`,
hex-encoded, compared against `razorpay_signature`. The SDK's
`validatePaymentVerification` helper implements exactly this and is what
this guide uses, so the exact concatenation never has to be hand-maintained:

```ts
// api/payments/verify-payment.ts
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ error: 'Missing verification fields' }, { status: 400 });
  }

  const isValid = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET!
  );

  if (!isValid) {
    return Response.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  // Verified. (Optional) write to Google Sheets Payments tab here — see §8.
  // Idempotency: key the write on razorpay_payment_id so a retried call
  // from a flaky network doesn't create a duplicate row.

  return Response.json({ status: 'verified', paymentId: razorpay_payment_id });
}
```

---

## 6. Recurring donations (subscriptions)

Razorpay recurring payments are **not** repeated one-time orders — they use a
distinct Plan → Subscription object model with its own Checkout mode and its
own webhook-driven lifecycle. This section follows that model.

### 6.1 Important design decision: Plans are immutable and cannot be deleted

A **Plan** (`POST /v1/plans`) is a reusable billing template: amount +
interval (e.g. "₹500 every 1 month"). Razorpay plans **cannot be edited or
deleted** once created. If you naively call "create plan" on every recurring
donation with a custom amount, you will accumulate one permanent, orphaned
Plan per unique amount ever donated — forever.

**Recommended approach for this app:** cache plan IDs by amount, and only
call the Plans API when no cached plan exists for that exact amount + "monthly"
interval:

```ts
// api/payments/create-subscription.ts (excerpt)
async function findOrCreatePlan(razorpay: Razorpay, amountInPaise: number) {
  // (optional) look up a cached plan_id for this amount first — e.g. in a
  // small KV store, or a "Plans" tab in the same Google Sheet. If found,
  // return it instead of calling the API again.

  const plan = await razorpay.plans.create({
    period: 'monthly',
    interval: 1,
    item: {
      name: `Monthly donation – ₹${amountInPaise / 100}`,
      amount: amountInPaise,
      currency: 'INR',
    },
  });

  // (optional) persist { amount, planId: plan.id } so the next donor at the
  // same amount reuses it instead of creating a new plan.

  return plan.id;
}
```

Without a cache this still works correctly — it's just not tidy. Treat the
cache as an optimization, not a correctness requirement; wire it up once the
(optional) Google Sheets module exists, using a `Plans` tab keyed by amount.

### 6.2 Create Subscription — `api/payments/create-subscription.ts`

Razorpay Subscriptions API: `POST https://api.razorpay.com/v1/subscriptions`.

```ts
// api/payments/create-subscription.ts
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const { amount, donor, type } = await request.json();

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
    const planId = await findOrCreatePlan(razorpay, Math.round(amount * 100));

    // Razorpay subscriptions require a finite total_count — there is no
    // literal "forever" option. Convention for "until the donor cancels":
    // use a large cycle count. At monthly billing, 120 cycles = 10 years.
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120,
      notes: {
        donor_name: donor.fullName,
        donor_email: donor.email,
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
```

A subscription the donor can cancel from your own UI later uses
`razorpay.subscriptions.cancel(subscriptionId)` — expose that as a separate
authenticated endpoint if/when you build a donor self-service page; it's out
of scope for this initial integration.

### 6.3 Frontend: open Checkout in subscription mode

Checkout.js supports subscriptions by passing `subscription_id` instead of
`order_id`/`amount`/`currency`:

```ts
async function payMonthly(amount: number, donor: DonorInfo): Promise<RazorpayResult> {
  const res = await fetch('/api/payments/create-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, donor, type: 'monthly' }),
  });
  if (!res.ok) throw new Error('Could not start subscription');
  const sub = await res.json();

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: sub.keyId,
      subscription_id: sub.subscriptionId,
      name: 'Isaahasi',
      description: 'Monthly donation',
      prefill: {
        name: donor.fullName,
        email: donor.email,
        contact: donor.mobileNumber,
      },
      handler: (response: RazorpaySubscriptionCheckoutResponse) => resolve(response),
      modal: { ondismiss: () => reject(new Error('cancelled')) },
    });
    rzp.open();
  });
}
```

On success, the handler receives `razorpay_payment_id`, `razorpay_subscription_id`,
and `razorpay_signature` (the subscription-flow equivalent of the order
fields above).

### 6.4 Verify Subscription Payment — `api/payments/verify-subscription.ts`

Razorpay's documentation and SDK draw a clear line between order-signature
verification and subscription-signature verification — they are *not* the
same formula, and the official docs do not publish the raw subscription
concatenation string on the pages this guide could reach. Rather than guess
it, use the SDK helper with the subscription-specific argument shape it
explicitly supports — this is a verified, documented call signature from the
`razorpay-node` SDK:

```ts
// api/payments/verify-subscription.ts
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';

export async function POST(request: Request) {
  const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = await request.json();

  if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ error: 'Missing verification fields' }, { status: 400 });
  }

  const isValid = validatePaymentVerification(
    { subscription_id: razorpay_subscription_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET!
  );

  if (!isValid) {
    return Response.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  return Response.json({ status: 'verified', subscriptionId: razorpay_subscription_id });
}
```

This confirms the **first** charge of the subscription only. Every
subsequent recurring charge (2nd month, 3rd month, ...) happens without the
donor's browser present — there is no Checkout handler to call back. **The
webhook is the only way to know about those.**

---

## 7. Webhooks — `api/razorpay/webhook.ts`

### 7.1 Setup

Dashboard → Settings → Webhooks → Add New Webhook:
- URL: `https://<your-domain>/api/razorpay/webhook`
- Secret: generate one, store it as `RAZORPAY_WEBHOOK_SECRET`
- Active events (minimum for this app):
  - One-time: `payment.captured`, `payment.failed`, `order.paid`
  - Recurring: `subscription.authenticated`, `subscription.activated`,
    `subscription.charged`, `subscription.completed`, `subscription.pending`,
    `subscription.halted`, `subscription.cancelled`, `subscription.paused`,
    `subscription.resumed`

### 7.2 Signature verification

Razorpay signs the webhook with `X-Razorpay-Signature: HMAC_SHA256(raw_body, webhook_secret)`,
hex-encoded. This **must** be computed over the exact raw bytes Razorpay
sent — not a re-serialized JSON object, which can differ in whitespace/key
order and silently break verification. This is the concrete reason this
guide uses the Web Standard handler format everywhere: `await request.text()`
gives the untouched raw body.

```ts
// api/razorpay/webhook.ts
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  const isValid = validateWebhookSignature(
    rawBody,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET!
  );

  if (!isValid) {
    return Response.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case 'payment.captured':
      // one-time donation confirmed — upsert Payments row keyed by payment.entity.id
      break;
    case 'payment.failed':
      // one-time donation failed — record/update status, do not fail the response
      break;
    case 'subscription.activated':
      // first recurring charge succeeded — subscription is live
      break;
    case 'subscription.charged':
      // a recurring cycle (2nd, 3rd, ...) succeeded — append a new Payments row,
      // keyed by event.payload.payment.entity.id so a redelivered webhook
      // doesn't create a duplicate
      break;
    case 'subscription.halted':
    case 'subscription.cancelled':
    case 'subscription.pending':
    case 'subscription.paused':
      // update subscription status for the donor record
      break;
    default:
      // acknowledge unhandled events without erroring, so Razorpay doesn't retry forever
      break;
  }

  return Response.json({ received: true });
}
```

### 7.3 Idempotency

Razorpay **will** redeliver the same webhook event (e.g. if your endpoint
times out or returns a non-2xx). Before writing a payment record, check
whether a row already exists for that `payment.entity.id` (one-time) or the
specific `event.payload.payment.entity.id` for a given `subscription.charged`
delivery, and skip the write if it's already there. The same guard protects
`verify-payment.ts` / `verify-subscription.ts` against duplicate calls from
double-clicks or browser retries — key every write on the Razorpay-issued ID,
never on a client-generated one.

Always return a `2xx` quickly (ideally < 5s) even for events you don't act
on — a non-2xx or timeout causes Razorpay to retry, which combined with
proper idempotency is safe, but combined with *missing* idempotency checks
is how duplicate donation records happen.

---

## 8. Google Sheets integration points (optional — not yet built)

The Stage 3 plan calls for reusing a `lib/googleSheets.ts` module and a
`Payments` tab. **Neither exists in this repo yet** — Stage 2 was not
actually completed despite the planning doc's assumption. This guide marks
every Sheets write above as optional so Razorpay can be integrated and tested
independently right now. When Stage 2 is built, the write points are:

- `verify-payment.ts` → one-time donation confirmed
- `verify-subscription.ts` → subscription created / first charge confirmed
- `webhook.ts` → `payment.captured`, `payment.failed`, `subscription.charged`,
  and the other lifecycle events above

Suggested `Payments` tab columns (from the Stage 3 doc, unchanged):
`Payment Record ID, Timestamp, Submission ID, Donor Name, Email, Mobile, Donation Type, Amount, Currency, Razorpay Order ID, Razorpay Payment ID, Razorpay Subscription ID, Payment Status`.

Use `razorpay_payment_id` / `razorpay_subscription_id` as the idempotency key
when upserting rows, per §7.3.

---

## 9. Frontend state machine

Matches the Stage 3 spec; wire it into `DonateModal.tsx` / `paymentService.ts`:

```
Idle → Creating payment → Opening Razorpay → Processing → Verifying → Success
                                   │                            │
                                   └──────── cancelled ─────────┤
                                                                 └──→ Failure
```

- **Creating payment**: `fetch('/api/payments/create-order' | 'create-subscription')` in flight. Disable the Donate button to prevent double-submits.
- **Opening Razorpay**: `rzp.open()` called.
- **Processing**: donor is inside the Checkout modal.
- **Verifying**: Checkout closed with a result; `fetch('/api/payments/verify-payment' | 'verify-subscription')` in flight.
- **Success**: verification returned `verified`.
- **Failure**: any step rejected — show a generic error, log details server-side only (never surface raw Razorpay/internal errors to the donor).
- `ondismiss` (donor closes modal without paying) → treat as cancellation, return to **Idle**, not **Failure**.

---

## 10. Testing checklist (Test Mode)

Use `rzp_test_...` keys. Razorpay's test cards/UPI IDs are listed in
Dashboard → Test Mode docs panel.

**One-time**
- [ ] Successful payment → `verify-payment` returns `verified`
- [ ] Failed payment (test failure card) → UI shows Failure, no record marked verified
- [ ] Donor closes Checkout modal → UI returns to Idle, not Failure
- [ ] Double-click Donate → only one order/payment created
- [ ] Tampered/garbage signature sent to `verify-payment` manually → rejected

**Recurring**
- [ ] Subscription creation + first charge → `verify-subscription` returns `verified`
- [ ] `subscription.charged` webhook fires on a simulated/test recurring cycle → Sheets row created once
- [ ] Redeliver the same webhook event from the Dashboard's "Test Webhook" tool → no duplicate record
- [ ] `subscription.halted` / `.cancelled` → status updates correctly

---

## 11. Going to production

- [ ] Switch Vercel env vars to **Live** `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- [ ] Create a **separate Live-mode webhook** in the Dashboard with its own secret → update `RAZORPAY_WEBHOOK_SECRET`
- [ ] Confirm the deployed domain is HTTPS (Vercel default) — Razorpay webhooks require HTTPS
- [ ] Re-run the full test matrix above against Live mode with a small real payment before announcing it's live
- [ ] If/when Google Sheets is wired up: confirm the service account has edit access to the production spreadsheet, and the spreadsheet ID env var points at the real sheet, not a test copy
- [ ] Confirm no `.env*` file was committed (`git status` / `.gitignore`)

---

## 12. File summary

New files this integration introduces (none exist yet):

```
isaahasi-frontend/
  api/
    payments/
      create-order.ts
      create-subscription.ts
      verify-payment.ts
      verify-subscription.ts
    razorpay/
      webhook.ts
  src/
    services/
      paymentService.ts   (extend — replace the Stage 1 stub)
```

`lib/googleSheets.ts` is referenced but intentionally left out of this
guide's file list — build it as part of (finally completing) Stage 2, then
hook the write calls described in §8.
