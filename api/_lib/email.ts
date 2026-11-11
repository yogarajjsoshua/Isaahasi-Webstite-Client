/**
 * Resend email helper.
 *
 * Sends the donation-receipt PDF to the donor by email via Resend's HTTPS
 * API. See RESEND_EMAIL_SETUP.md for how to provision the API key, verify
 * a sending domain, and set the env vars below.
 */

import { Resend } from "resend";

// CC'd on every receipt email (one-time and monthly/subscription).
const RECEIPT_CC_EMAIL = "info.isaahasi@gmail.com";

export interface ReceiptEmailInput {
  to: string;
  donorName: string;
  receiptNo: string;
  amount: number;
  pdfBytes: Uint8Array;
  /**
   * Whether this receipt is for a one-time donation or one installment of a
   * recurring monthly donation. Defaults to one-time behavior when omitted —
   * this keeps the existing (already-shipped) subject/body copy unchanged
   * for the current caller, api/payments/verify-payment.ts.
   */
  donationType?: "one-time" | "monthly";
  /**
   * Which installment/month this receipt covers, e.g. Razorpay's
   * subscription.paid_count. Only meaningful when donationType is "monthly".
   */
  installmentNumber?: number;
  /**
   * Forwarded to Resend as the Idempotency-Key header. Resend remembers a key
   * for 24 hours: a repeat returns the original response without sending, and
   * a concurrent request with the same key is rejected.
   */
  idempotencyKey?: string;
}

/**
 * - "sent": Resend accepted the email.
 * - "already-sent": Resend rejected the idempotency key as a repeat of an
 *   earlier send (same key, different payload), so the donor already has it.
 * - "in-flight": another request with the same key is sending right now.
 */
export type SendReceiptResult = "sent" | "already-sent" | "in-flight";

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
export async function sendReceiptEmail(input: ReceiptEmailInput): Promise<SendReceiptResult> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not set in this environment");
  }

  const resend = getResendClient();

  const isMonthly = input.donationType === "monthly";

  // The one-time subject/body strings below are byte-for-byte identical to
  // the original, already-shipped copy — do not alter them. Only the
  // monthly branch introduces new copy.
  const subject = isMonthly
    ? input.installmentNumber != null
      ? `Your monthly donation receipt — installment #${input.installmentNumber} — ${input.receiptNo}`
      : `Your monthly donation receipt — ${input.receiptNo}`
    : `Your donation receipt — ${input.receiptNo}`;

  const html = isMonthly
    ? `
      <p>Dear ${input.donorName},</p>
      <p>Thank you for your continued generosity! We've received this month's installment${
        input.installmentNumber != null ? ` (installment #${input.installmentNumber})` : ""
      } of your
      monthly donation of ₹${input.amount.toLocaleString("en-IN")}
      to iSaahasi Academy India Foundation.</p>
      <p>Your official donation receipt for this installment is attached to this email. Please keep it
      for your records — it may be required for tax purposes.</p>
      <p>With gratitude,<br/>iSaahasi Academy India Foundation</p>
    `
    : `
      <p>Dear ${input.donorName},</p>
      <p>Thank you for your generous donation of ₹${input.amount.toLocaleString("en-IN")}
      to iSaahasi Academy India Foundation.</p>
      <p>Your official donation receipt is attached to this email. Please keep it for your
      records — it may be required for tax purposes.</p>
      <p>With gratitude,<br/>iSaahasi Academy India Foundation</p>
    `;

  const { data, error } = await resend.emails.send(
    {
      from: `iSaahasi Academy India Foundation <${fromEmail}>`,
      to: input.to,
      ...(input.to.trim().toLowerCase() !== RECEIPT_CC_EMAIL ? { cc: RECEIPT_CC_EMAIL } : {}),
      subject,
      html,
      attachments: [
        {
          filename: `receipt-${input.receiptNo}.pdf`,
          content: Buffer.from(input.pdfBytes),
        },
      ],
    },
    input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
  );

  if (error?.name === "invalid_idempotent_request") {
    console.warn("sendReceiptEmail: idempotency key already used", input.idempotencyKey);
    return "already-sent";
  }
  if (error?.name === "concurrent_idempotent_requests") {
    console.warn("sendReceiptEmail: same key is being sent by another request", input.idempotencyKey);
    return "in-flight";
  }

  if (error) {
    // Log the full error object, not just .message — Resend's error shapes
    // (e.g. the sandbox sender restriction) carry useful detail beyond it.
    console.error("sendReceiptEmail: Resend API returned an error", error);
    throw new Error(`Resend send failed: ${error.message}`);
  }

  console.log("sendReceiptEmail: sent", { id: data?.id, to: input.to, receiptNo: input.receiptNo });
  return "sent";
}
