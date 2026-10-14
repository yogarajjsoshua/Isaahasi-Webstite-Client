import { mkdir, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { generateReceiptPdf, type ReceiptData } from '../_lib/receipt.js';

interface GenerateReceiptBody {
  donorName?: string;
  amount: number;
  amountInWords?: string;
  purpose?: string;
  paymentId: string;
  paymentMethod?: string;
}

export interface ReceiptGenerationResult {
  receiptNo: string;
  path: string;
  pdfBytes: Uint8Array;
}

// Serverless runtimes (e.g. Vercel) ship a read-only filesystem except for
// os.tmpdir() — process.cwd() writes fail silently in production, which is
// why receiptPath previously came back null and the receipt email never sent.
const GENERATED_DIR = path.join(os.tmpdir(), 'isaahasi-receipts');

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

function twoDigitsToWords(n: number): string {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${TENS[tens]} ${ONES[ones]}` : TENS[tens];
}

function threeDigitsToWords(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest) parts.push(twoDigitsToWords(rest));
  return parts.join(' ');
}

/**
 * Converts a non-negative integer rupee amount into words using the Indian
 * numbering system (Crore / Lakh / Thousand), e.g. 150000 -> "One Lakh Fifty Thousand".
 */
export function numberToIndianWords(amount: number): string {
  const value = Math.max(0, Math.round(amount));
  if (value === 0) return 'Zero';

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = value % 1000;

  const parts: string[] = [];
  if (crore) parts.push(`${threeDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${threeDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(threeDigitsToWords(hundred));

  return parts.join(' ').trim();
}

function formatDateDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function buildReceiptNo(paymentId?: string): string {
  const suffix = paymentId && paymentId.trim() !== '' ? paymentId : String(Date.now());
  return `RCPT-${suffix}`;
}

/**
 * Builds a ReceiptData record from the pragmatic fields we have on hand,
 * renders the PDF via generateReceiptPdf, and persists it under
 * generated/. Exported so verify-payment.ts can call it directly without an
 * internal HTTP round-trip.
 */
export async function buildAndSaveReceipt(
  input: GenerateReceiptBody,
): Promise<ReceiptGenerationResult> {
  const receiptNo = buildReceiptNo(input.paymentId);
  const date = formatDateDDMMYYYY(new Date());
  const amountInWords =
    input.amountInWords && input.amountInWords.trim() !== ''
      ? input.amountInWords
      : `Rupees ${numberToIndianWords(input.amount)} Only`;

  const data: ReceiptData = {
    receiptNo,
    date,
    receivedFrom: input.donorName && input.donorName.trim() !== '' ? input.donorName : 'Donor',
    amountInWords,
    amountNumber: Number(input.amount).toLocaleString('en-IN'),
    paymentMethod: input.paymentMethod && input.paymentMethod.trim() !== '' ? input.paymentMethod : 'N/A',
    purpose: input.purpose && input.purpose.trim() !== '' ? input.purpose : 'Donation',
  };

  const pdfBytes = await generateReceiptPdf(data);

  await mkdir(GENERATED_DIR, { recursive: true });
  const fileName = `receipt-${input.paymentId || Date.now()}.pdf`;
  const absolutePath = path.join(GENERATED_DIR, fileName);
  await writeFile(absolutePath, pdfBytes);

  return { receiptNo, path: path.join('generated', fileName), pdfBytes };
}

export async function POST(request: Request) {
  const body = (await request.json()) as GenerateReceiptBody;
  const { amount, paymentId } = body;

  if (!Number.isFinite(amount) || amount <= 0) {
    return Response.json({ error: 'Invalid or missing amount' }, { status: 400 });
  }
  if (!paymentId || typeof paymentId !== 'string' || paymentId.trim() === '') {
    return Response.json({ error: 'Missing paymentId' }, { status: 400 });
  }

  try {
    const result = await buildAndSaveReceipt(body);
    return Response.json({ success: true, receiptNo: result.receiptNo, path: result.path });
  } catch (err) {
    console.error('receipts/generate failed', err);
    return Response.json({ error: 'Could not generate receipt' }, { status: 500 });
  }
}
