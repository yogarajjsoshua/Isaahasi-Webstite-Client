/**
 * Resend email helper.
 *
 * Sends the donation-receipt PDF to the donor by email via Resend's HTTPS
 * API. See RESEND_EMAIL_SETUP.md for how to provision the API key, verify
 * a sending domain, and set the env vars below.
 */

import { Resend } from "resend";

export interface ReceiptEmailInput {
  to: string;
  donorName: string;
  receiptNo: string;
  amount: number;
  pdfBytes: Uint8Array;
}

// Constructing `new Resend(...)` at module scope would throw synchronously
// the moment this file is imported if RESEND_API_KEY is unset — before
// verify-payment.ts's try/catch around sendReceiptEmail even exists, which
// would crash the whole request. Resolving the client lazily, inside the
// function the caller already wraps in try/catch, turns that into a normal
// catchable error instead.
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set in this environment");
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

/**
 * Emails the receipt PDF to the donor. Throws on failure — the caller is
 * responsible for catching and deciding whether that should fail the
 * response (it shouldn't; see api/payments/verify-payment.ts).
 */
export async function sendReceiptEmail(input: ReceiptEmailInput): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not set in this environment");
  }

  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: `iSaahasi Academy India Foundation <${fromEmail}>`,
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
    // Log the full error object, not just .message — Resend's error shapes
    // (e.g. the sandbox sender restriction) carry useful detail beyond it.
    console.error("sendReceiptEmail: Resend API returned an error", error);
    throw new Error(`Resend send failed: ${error.message}`);
  }

  console.log("sendReceiptEmail: sent", { id: data?.id, to: input.to, receiptNo: input.receiptNo });
}
