/**
 * Standalone test for the PDF receipt generation engine (api/_lib/receipt.ts),
 * run without needing a real Razorpay payment or the dev server.
 *
 * Usage:
 *   npm run test:receipt
 */
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { generateReceiptPdf, type ReceiptData } from '../api/_lib/receipt';

const sampleReceipt: ReceiptData = {
  receiptNo: `RCPT-${Date.now()}`,
  date: new Date().toLocaleDateString('en-GB').split('/').join('-'), // DD-MM-YYYY
  receivedFrom: 'Jane Doe',
  amountInWords: 'Rupees Five Thousand Only',
  amountNumber: '5,000',
  paymentMethod: 'Online (Razorpay)',
  purpose: 'Donation',
};

async function main() {
  console.log('Generating sample receipt PDF with data:', sampleReceipt);

  const pdfBytes = await generateReceiptPdf(sampleReceipt);

  const outDir = path.join(process.cwd(), 'generated');
  await mkdir(outDir, { recursive: true });

  const outPath = path.join(outDir, 'test-receipt.pdf');
  await writeFile(outPath, pdfBytes);

  console.log(`Receipt PDF written to ${outPath}`);
}

main().catch((err) => {
  console.error('test-receipt-generation failed:', err);
  process.exitCode = 1;
});
