/**
 * Resend email helper.
 *
 * Sends the donation-receipt PDF to the donor by email via Resend's HTTPS
 * API. See RESEND_EMAIL_SETUP.md for how to provision the API key, verify
 * a sending domain, and set the env vars below.
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

const resend = new Resend(RESEND_API_KEY);

export interface ReceiptEmailInput {
  to: string;
  donorName: string;
  receiptNo: string;
  amount: number;
  pdfBytes: Uint8Array;
}

/**
 * Emails the receipt PDF to the donor. Throws on failure — the caller is
 * responsible for catching and deciding whether that should fail the
 * response (it shouldn't; see api/payments/verify-payment.ts).
 */
export async function sendReceiptEmail(input: ReceiptEmailInput): Promise<void> {
  const { error } = await resend.emails.send({
    from: `iSaahasi Academy India Foundation <${FROM_EMAIL}>`,
    to: input.to,
    subject: `Your donation receipt — ${input.receiptNo}`,
    html: `
      <p>Dear ${input.donorName},</p>
      <p>Thank you for your generous donation of ₹${input.amount.toLocaleString("en-IN")}
      to iSaahasi Academy India Foundation.</p>
      <p>Your official donation receipt is attached to this email. Please keep it for your
      records — it may be required for tax purposes.</p>
      <p>With gratitude,<br/>iSaahasi Academy India Foundation</p>
    `,
    attachments: [
      {
        filename: `receipt-${input.receiptNo}.pdf`,
        content: Buffer.from(input.pdfBytes),
      },
    ],
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }
}
