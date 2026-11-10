# Plan: Vercel Cron for monthly subscription receipts (live-subscriptions tab)

## Context
Monthly donors are auto-charged by Razorpay with no browser involved, and the Razorpay dashboard webhook can't be edited, so
`api/razorpay/webhook.ts` is not a reliable trigger. Today no subscription charge (first or renewal) sends a receipt email; only
one-time donations do (`api/payments/verify-payment.ts`). Goal: a daily Vercel Cron job that asks Razorpay what was charged, emails a
receipt for every new charge **exactly once**, and tracks only **live** subscriptions in a **separate Google Sheet tab**. Cancelled,
completed and expired subscriptions are removed from that tab.

Decision made (change if wrong): "separate sheet" = a new tab named `Live Subscriptions` in the existing spreadsheet
(`GOOGLE_SHEETS_SPREADSHEET_ID`), not a second spreadsheet file. The helpers only know one spreadsheet ID, so a second file would need more env/config.

## Design

### Tab: `Live Subscriptions` (created manually, header row 1; columns in this order)
A Subscription ID | B Donor Name | C Email | D Mobile | E Amount (INR) | F Razorpay Status | G **Receipt Payment IDs** | H Created At | I Last Checked

- `Receipt Payment IDs` holds the Razorpay payment id of every receipt already emailed for that subscription, separated by `, `
  (example: `pay_111, pay_222, pay_333`). It is the source of truth for "was this charge already emailed".
- Installment number for an email = position of that payment in the subscription's paid invoices sorted by `paid_at` (1-based). It does not
  depend on the cell count, so a missed charge can't shift later numbers.
- Live means status in `authenticated, active, pending, paused, halted`. Remove the row on `cancelled, completed, expired`.
  `created` rows (donor never finished the first payment) are removed once older than 2 days. `halted` and `paused` are kept because they can resume.

### Row lifecycle
1. **Add:** `api/payments/create-subscription.ts` appends a row after `razorpay.subscriptions.create` succeeds (status `created`, empty `Receipt Payment IDs`).
   Check `columnContainsValue('Live Subscriptions', 'A', subscriptionId)` first so the same subscription never gets two rows.
   Wrap in try/catch: a Sheets failure must never fail the response.
2. **Process (cron, daily):** for each row, `razorpay.subscriptions.fetch(id)` gives `status`.
   - Prune per the live rule above.
   - `razorpay.invoices.all({ subscription_id })`, keep paid invoices, sort by `paid_at` ascending. Every invoice whose `payment_id` is **not** in the cell is a new charge. For each, in order:
     `buildAndSaveReceipt` -> `sendReceiptEmail({ donationType: 'monthly', installmentNumber, idempotencyKey })` -> record the id in the cell -> write the Payments row (deduped by column K).
     Stop at the first failure for that subscription so the next run retries from the same point.
3. **Remove:** delete pruned rows after all processing, bottom-up so row numbers don't shift. An unreceipted final charge is processed before a cancelled row is deleted.

### No-duplicate guarantees (layered)
Google Sheets has no transactions, so no single check is perfect. These layers together cover each failure case:

| Failure case | Guard |
|---|---|
| Normal re-run (next day, manual re-trigger) | **Cell check:** payment id already in `Receipt Payment IDs` -> skipped. |
| Same payment id written into the cell twice | `appendReceiptId` is set-based: it re-reads the live cell right before writing, splits on `,`, trims, and never writes an id already present. The cell therefore can't contain duplicate ids. |
| Email sent but the cell write failed | Retry the cell write 3 times with short backoff right after the send, in the same run. |
| Two runs overlap (manual trigger during the scheduled run, or the optional instant send in step 7) | **Resend idempotency key** `monthly-receipt/<payment_id>`: a concurrent request with the same key gets 409 `concurrent_idempotent_requests` and is skipped, and a repeat within 24 hours returns the original response without sending. |
| Same subscription accidentally has two rows | The cron groups rows by Subscription ID, merges their receipt ids into the first row, and deletes the extras before sending anything. |

Notes:
- Resend remembers keys for only 24 hours, and a daily cron can run slightly past that, so the key is a guard for retries and overlapping runs, not the main record. The cell is.
- If Resend answers 409 `invalid_idempotent_request` (same key, different payload, e.g. the PDF date changed on a later day), treat it as "already sent" and record the id. Verify the SDK's error shape when implementing.
- Rejected idea: using the Payments tab's column K as a "receipt sent" guard. The webhook also writes that column, so a payment id there only means the charge was recorded, not emailed.
- If the sheet write still fails after retries, the next run sends that receipt again. The plan accepts a rare duplicate over a missed receipt.

## Changes

1. **`api/_lib/sheets.ts`** (add alongside `appendFormRow` and `columnContainsValue`; reuse the existing JWT client):
   - `getRows(sheetName)` returns all rows with their sheet row numbers (`values.get`).
   - `updateCell(sheetName, rowNumber, column, value)` and `updateRow(...)` (`values.update`, RAW). Receipt ids are written with `updateCell` on column G only, so a concurrent edit to other columns isn't overwritten.
   - `deleteRows(sheetName, rowNumbers[])` (`spreadsheets.get` to resolve numeric sheetId by title, then `batchUpdate` `deleteDimension`, highest row first).
2. **`api/_lib/email.ts`**: add optional `idempotencyKey` to `ReceiptEmailInput` and pass it as `resend.emails.send(payload, { idempotencyKey })`. The one-time path passes none, so `verify-payment.ts` behaviour is unchanged.
3. **`api/_lib/paymentsSheet.ts`** (new): move `buildPaymentsRow` and `recordPaymentRow` out of `api/razorpay/webhook.ts` so the webhook and the cron share one column order and one dedupe (column K). Webhook imports them back; behaviour unchanged.
4. **`api/_lib/subscriptionReceipts.ts`** (new): `processLiveSubscriptions({ deadlineMs })` holding the logic above, plus `appendReceiptId`. Small concurrency (about 5 subscriptions at a time, one row's charges strictly in order) and a time budget of about 50s; rows not reached stay as they are for the next run. Reuses `buildAndSaveReceipt` (`api/receipts/generate.ts`, `receiptNo = RCPT-<payment id>`, so receipt numbers are unique per charge) and `sendReceiptEmail`.
5. **`api/cron/send-subscription-receipts.ts`** (new): `export async function GET(request)`, matching the repo's Web-standard named-export style.
   Fail closed: 401 unless `Authorization === Bearer ${CRON_SECRET}` and `CRON_SECRET` is set. Returns `{ processed, receiptsSent, skippedAlreadySent, removed, failed }`.
6. **`vercel.json`** (new, none exists): `crons` entry, schedule `30 3 * * *` (UTC, off the :00 mark; Hobby allows once per day only, run time is only accurate to within the hour).
   `functions` entry for the cron path with `maxDuration: 60` and `includeFiles: "api/_assets/**"` because the receipt template and signature are read from disk and nothing currently declares them.
7. **`api/payments/create-subscription.ts`**: append the `Live Subscriptions` row (step 1 of lifecycle).
8. **(Optional, small)** `api/payments/verify-subscription.ts`: after signature verification, call the same processor for just that subscription so the first receipt is instant instead of up to a day late. It can overlap with the cron, which is why the Resend idempotency key matters.
9. **Docs/env:** add `CRON_SECRET=` to `.env.example`; document the new tab and columns in `GOOGLE_SHEETS_SETUP.md`; update `RazorPay_Implementation.md` (line 16 says no `vercel.json`; add `CRON_SECRET` to the env table and production checklist); add a cron section to `RESEND_EMAIL_SETUP.md`.

## Things to know / risks
- Vercel cron runs only on the **production** deployment and sends the `CRON_SECRET` bearer automatically once that env var is set in the Vercel project.
- Resend free tier is capped at 100 emails/day. Renewal dates cluster on the day of the month donors start, so 100+ same-day renewals would exceed it. Unsent receipts are retried on the next run because their ids aren't in the cell.
- The Vercel docs call Cron Jobs a legacy feature being migrated to "Schedules"; it still works today.
- Not yet verified: that `razorpay.invoices.all({ subscription_id })` returns `payment_id` and `status: 'paid'` on each invoice. Confirm in test mode before relying on it.
- Receipt PDFs are generated in memory and emailed. `/tmp` writes are ephemeral and are not relied on.
- `api/` isn't typechecked by `npm run build`, so run `npx tsc --noEmit` against the new files manually.
- Out of scope: the failed-renewal email to the donor, and removing the unauthenticated `api/debug-env.ts` (flagged only).
- The webhook is left in place. If it ever gets configured, both paths write the Payments row through the same dedupe and the cron remains the only sender of emails.

## Verification (Razorpay test mode)
1. Create the `Live Subscriptions` tab with the header row; set `CRON_SECRET` locally in `.env.local`.
2. `vercel dev`, create a monthly donation with a test card -> check a row appears with status `created`, then complete the payment.
3. `curl -H "Authorization: Bearer $CRON_SECRET" localhost:3000/api/cron/send-subscription-receipts` -> expect one email ("installment #1", PDF attached), one payment id in `Receipt Payment IDs`, and a Payments row.
4. Run the curl again -> no second email, response shows `skippedAlreadySent: 1`.
5. Run two curls at the same time -> still exactly one email.
6. Clear the `Receipt Payment IDs` cell and run again within 24 hours -> no new email arrives (Resend's key blocks it) and the id is written back to the cell. This proves the second guard.
7. Paste the same payment id into the cell twice by hand and run -> the cell is rewritten without duplicates.
8. Add a second row with the same Subscription ID -> the extra row is merged and deleted, with no duplicate send.
9. Cancel the subscription in the Razorpay test dashboard, run the curl -> the row is deleted.
10. Call the endpoint with a missing or wrong bearer -> 401.
11. Deploy to production, confirm the cron appears in Vercel -> Settings -> Cron Jobs and trigger it once manually from there.
