/**
 * Standalone test for the SUBSCRIPTION (monthly donation) receipt-email
 * branch of sendReceiptEmail (api/_lib/email.ts) — the `donationType:
 * "monthly"` / `installmentNumber` path.
 *
 * Why this script exists: no production endpoint currently calls
 * sendReceiptEmail with donationType "monthly". Today the only caller is
 * api/payments/verify-payment.ts, and it always sends the one-time
 * (donationType omitted/"one-time") copy. api/payments/create-subscription.ts,
 * api/payments/verify-subscription.ts, and the subscription.* handlers in
 * api/razorpay/webhook.ts never touch sendReceiptEmail at all. That means
 * the "monthly" branch has shipped but has never actually been exercised
 * end-to-end — this script calls it directly so a human can manually
 * confirm it sends a correct email before any real endpoint is wired to it.
 *
 * It builds a sample subscription donor (shaped like
 * api/payments/create-subscription.ts's donor payload), generates a real
 * receipt PDF via api/_lib/receipt.ts (same engine
 * scripts/test-receipt-generation.ts uses — not a stub), and then either
 * previews or actually calls sendReceiptEmail with
 * { donationType: "monthly", installmentNumber: 3, ... }.
 *
 * SAFETY: dry-run by default. In dry-run mode this script builds the PDF
 * and the exact sendReceiptEmail input, and prints a preview — it never
 * calls sendReceiptEmail and never touches the live Resend API. The
 * recipient is hard-coded to yjoshuak@gmail.com (the explicit test address
 * this script is meant to send to); only an explicit opt-in switches to a
 * real send.
 *
 * Usage:
 *   # Dry run (default) — safe, sends nothing:
 *   npm run test:subscription-email
 *
 *   # Live send — actually calls sendReceiptEmail and sends a real email.
 *   # Either flag works:
 *   npm run test:subscription-email -- --live
 *   SEND_LIVE=1 npm run test:subscription-email
 *
 *   Live mode requires RESEND_API_KEY and RESEND_FROM_EMAIL to be set in
 *   the environment (see RESEND_EMAIL_SETUP.md / .env.local) — sendReceiptEmail
 *   throws if either is missing.
 */
import { generateReceiptPdf, type ReceiptData } from '../api/_lib/receipt';
import { sendReceiptEmail } from '../api/_lib/email';

// Explicit test recipient this script is meant to send to. An env override
// exists only as an escape hatch — the default is always this address, per
// the task this script was written for; it is never pointed elsewhere by
// default.
const TEST_RECIPIENT_EMAIL = process.env.TEST_RECIPIENT_EMAIL || 'yjoshuak@gmail.com';

const isLive = process.argv.includes('--live') || process.env.SEND_LIVE === '1';

// Sample subscription donor, shaped like api/payments/create-subscription.ts's
// CreateSubscriptionBody.donor (fullName, email, mobileNumber, address,
// nationality, panNumber). All values below are fake/sample data.
const sampleDonor = {
  fullName: 'Ananya Sharma',
  email: TEST_RECIPIENT_EMAIL,
  mobileNumber: '+91 98765 43210',
  address: '14 MG Road, Indiranagar, Bengaluru, Karnataka 560038',
  nationality: 'Indian',
  panNumber: 'ABCDE1234F',
};

// A realistic recurring-donation amount — the kind of amount
// create-subscription.ts turns into a Razorpay monthly plan.
const MONTHLY_AMOUNT = 2000;

// Which installment of the subscription this simulates — Razorpay's
// subscription.paid_count would be 3 for the third successful monthly
// charge.
const INSTALLMENT_NUMBER = 3;

// Looks like a real Razorpay subscription payment id prefixed the same way
// api/receipts/generate.ts's buildReceiptNo() prefixes a paymentId
// ("RCPT-" + paymentId). Fixed (not timestamp-generated) so repeated dry
// runs are easy to diff.
const SAMPLE_RECEIPT_NO = 'RCPT-sub_test_HJ8x7QmN2kPz';

const sampleReceipt: ReceiptData = {
  receiptNo: SAMPLE_RECEIPT_NO,
  date: new Date().toLocaleDateString('en-GB').split('/').join('-'), // DD-MM-YYYY
  receivedFrom: sampleDonor.fullName,
  amountInWords: 'Rupees Two Thousand Only',
  amountNumber: MONTHLY_AMOUNT.toLocaleString('en-IN'),
  paymentMethod: 'Online (Razorpay) — Monthly Subscription',
  purpose: `Monthly Donation — Installment #${INSTALLMENT_NUMBER}`,
};

/**
 * Prints env vars this script touches. Per the project's secret-handling
 * convention (see scripts/debug-sheets.mjs), a secret value is NEVER logged
 * in full — only a short partial preview plus its length, enough to confirm
 * "something plausible is set" without exposing the key.
 */
function previewEnv() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  console.log('--- environment (secrets redacted) ---');
  console.log(
    '  RESEND_API_KEY:',
    apiKey ? `${JSON.stringify(apiKey.slice(0, 10))}... (set, ${apiKey.length} chars)` : '(not set)',
  );
  // RESEND_FROM_EMAIL is a sender address, not a secret, so it's fine to
  // print in full.
  console.log('  RESEND_FROM_EMAIL:', fromEmail || '(not set)');
}

async function main() {
  console.log(`Mode: ${isLive ? 'LIVE SEND' : 'DRY RUN'}`);
  console.log(
    isLive
      ? '(--live or SEND_LIVE=1 was given — this WILL call sendReceiptEmail and send a real email.)'
      : '(default — nothing will be sent; pass --live or set SEND_LIVE=1 to actually send.)',
  );
  previewEnv();

  console.log('\nSample subscription donor (fake/sample data):', sampleDonor);
  console.log('Generating sample subscription receipt PDF with data:', sampleReceipt);

  const pdfBytes = await generateReceiptPdf(sampleReceipt);
  console.log(`Receipt PDF generated (${pdfBytes.length} bytes).`);

  // This is the exact input shape sendReceiptEmail expects for the
  // subscription/monthly branch (api/_lib/email.ts's ReceiptEmailInput).
  const emailInput = {
    to: TEST_RECIPIENT_EMAIL,
    donorName: sampleDonor.fullName,
    receiptNo: SAMPLE_RECEIPT_NO,
    amount: MONTHLY_AMOUNT,
    pdfBytes,
    donationType: 'monthly' as const,
    installmentNumber: INSTALLMENT_NUMBER,
  };

  // Mirrors sendReceiptEmail's own subject-building logic for the monthly
  // branch (api/_lib/email.ts) — for preview purposes only. The real send
  // (live mode) computes the subject inside sendReceiptEmail itself; this
  // is just so the dry-run preview below can show what to expect.
  const previewSubject =
    emailInput.installmentNumber != null
      ? `Your monthly donation receipt — installment #${emailInput.installmentNumber} — ${emailInput.receiptNo}`
      : `Your monthly donation receipt — ${emailInput.receiptNo}`;

  console.log('\n--- sendReceiptEmail input preview ---');
  console.log('  to:', emailInput.to);
  console.log('  donorName:', emailInput.donorName);
  console.log('  receiptNo:', emailInput.receiptNo);
  console.log('  amount:', emailInput.amount);
  console.log('  donationType:', emailInput.donationType);
  console.log('  installmentNumber:', emailInput.installmentNumber);
  console.log('  pdfBytes length:', emailInput.pdfBytes.length, 'bytes');
  console.log('  subject (preview):', previewSubject);

  if (!isLive) {
    console.log('\nDRY RUN complete — sendReceiptEmail was NOT called; no email was sent.');
    console.log('To actually send this email, re-run with --live or SEND_LIVE=1.');
    return;
  }

  console.log('\nLIVE SEND — calling sendReceiptEmail now...');
  await sendReceiptEmail(emailInput);
  console.log(`LIVE SEND complete — check ${TEST_RECIPIENT_EMAIL} for the email.`);
}

main().catch((err) => {
  console.error('test-subscription-email-flow failed:', err);
  process.exitCode = 1;
});
