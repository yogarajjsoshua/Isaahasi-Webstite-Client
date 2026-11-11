/**
 * Sends one real test receipt email through sendReceiptEmail
 * (api/_lib/email.ts) using the RESEND_API_KEY / RESEND_FROM_EMAIL from
 * .env.local.
 *
 * Usage:
 *   npm run send:test-email
 *   npm run send:test-email -- someone@example.com
 *
 * Recipient: first CLI arg, else TEST_RECIPIENT_EMAIL, else yogarajkomati@gmail.com.
 * While the sender is onboarding@resend.dev, Resend only delivers to your own
 * account email; with a verified domain any recipient works.
 */
import { generateReceiptPdf, type ReceiptData } from '../api/_lib/receipt';
import { sendReceiptEmail } from '../api/_lib/email';

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file);
  } catch {
    // file missing — fall back to whatever is already in the environment
  }
}

const recipient =
  process.argv.slice(2).find((a) => !a.startsWith('-')) ||
  process.env.TEST_RECIPIENT_EMAIL ||
  'yogarajkomati@gmail.com';

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL must be set (.env.local or shell).');
  }

  console.log('RESEND_API_KEY:   ', `${apiKey.slice(0, 6)}... (${apiKey.length} chars)`);
  console.log('RESEND_FROM_EMAIL:', fromEmail);
  console.log('From header:      ', `iSaahasi Academy India Foundation <${fromEmail}>`);
  console.log('Recipient:        ', recipient);

  const receiptNo = `RCPT-test_${Date.now()}`;
  const amount = 500;

  const receipt: ReceiptData = {
    receiptNo,
    date: new Date().toLocaleDateString('en-GB').split('/').join('-'),
    receivedFrom: 'Test Donor',
    amountInWords: 'Rupees Five Hundred Only',
    amountNumber: amount.toLocaleString('en-IN'),
    paymentMethod: 'Online (Razorpay)',
    purpose: 'Test email',
  };

  const pdfBytes = await generateReceiptPdf(receipt);
  console.log(`\nReceipt PDF generated (${pdfBytes.length} bytes). Sending...`);

  const result = await sendReceiptEmail({
    to: recipient,
    donorName: 'Test Donor',
    receiptNo,
    amount,
    pdfBytes,
  });

  console.log(`Result: ${result}. Check ${recipient} (and spam).`);
}

main().catch((err) => {
  console.error('send-test-email failed:', err);
  process.exitCode = 1;
});
