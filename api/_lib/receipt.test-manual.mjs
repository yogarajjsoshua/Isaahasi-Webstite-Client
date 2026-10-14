// Throwaway manual test harness for generateReceiptPdf.
// Run with: npx tsx api/_lib/receipt.test-manual.mjs
// (uses tsx to execute the TS module directly). Delete this file once the
// generation module has been visually verified.

import { generateReceiptPdf } from "./receipt.ts";
import fs from "fs/promises";

const sample = {
  receiptNo: "1024",
  date: "13-10-2026",
  receivedFrom: "Mr. Arvind Subramaniam",
  amountInWords: "Five Thousand Rupees Only",
  amountNumber: "5,000",
  paymentMethod: "Razorpay / Online - pay_XXXXXXXXXXXX",
  purpose: "Donation",
};

const bytes = await generateReceiptPdf(sample);
await fs.mkdir("generated", { recursive: true });
await fs.writeFile("generated/sample-receipt.pdf", bytes);
console.log("wrote generated/sample-receipt.pdf", bytes.length, "bytes");
