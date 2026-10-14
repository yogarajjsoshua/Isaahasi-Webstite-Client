/**
 * Donation-receipt PDF generator.
 *
 * Fills the printed ISAAHASI ACADEMY INDIA FOUNDATION receipt template
 * (`api/_assets/receipt-template.pdf`) with submitted data and overlays a
 * signature image (`api/_assets/signature.png`), returning the finished
 * PDF as raw bytes.
 *
 * ---------------------------------------------------------------------------
 * COORDINATE SYSTEM NOTE (read this before touching any constant below)
 * ---------------------------------------------------------------------------
 * The template PDF's page has `/Rotate 270`. pdf-lib's `drawText`/`drawImage`
 * operate in the page's RAW (unrotated) content-stream space, which does NOT
 * match the visually rendered page you see on screen / in a PDF viewer.
 *
 * All layout constants in this file are expressed in VISUAL coordinates
 * (Xv, Yv), i.e. "as if the page rotation didn't exist":
 *   - Xv = 0 at the visual left edge, increasing rightward.
 *   - Yv = 0 at the visual top edge, increasing downward.
 *   - Units are PDF points (1/72 inch), matching the rendered page size of
 *     roughly 2034 x 1378 pt (Hraw x Wraw, see below).
 *
 * This was derived empirically (NOT from the theoretical /Rotate formula,
 * which does not apply cleanly here) by drawing marker rectangles at known
 * raw coordinates, rendering with `pdftoppm -png -r 150`, and visually
 * reading back where they landed. The mapping was confirmed across 5
 * reference points to within ~0.5pt, and the companion rotation hypothesis
 * (`rotate: degrees(270)` on every drawn element) was independently
 * re-verified with real upright, left-to-right-reading text before this
 * file was written (see calibration notes in the PR / handback report).
 *
 * The transform from visual -> raw is:
 *   raw_x = Wraw - Yv
 *   raw_y = Hraw - Xv
 * where Wraw = page.getWidth(), Hraw = page.getHeight() of the raw page
 * (≈ 1377.74 x 2034.23 pt for this template).
 *
 * Every drawn element (text AND images) must also be drawn with
 * `rotate: degrees(270)` around its own (raw_x, raw_y) anchor point for it
 * to appear upright in the rendered output. With that rotation applied,
 * `drawText`/`drawImage`'s (x, y) anchor behaves exactly like normal
 * top-of-stack-API text: it is the visual bottom-left corner, content
 * extends rightward (+Xv) and upward (-Yv) from there — so laying things
 * out in (Xv, Yv) feels completely ordinary once you go through `toRaw()`.
 * ---------------------------------------------------------------------------
 */

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  degrees,
  rgb,
} from "pdf-lib";

export interface ReceiptData {
  receiptNo: string;
  date: string;
  receivedFrom: string;
  amountInWords: string;
  amountNumber: string;
  paymentMethod: string;
  purpose: string;
}

// ---------------------------------------------------------------------------
// Asset paths — resolved relative to THIS module file (not process.cwd()),
// since this runs inside a serverless function where the working directory
// is not guaranteed to be the project root.
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, "..", "_assets", "receipt-template.pdf");
const SIGNATURE_PATH = path.join(__dirname, "..", "_assets", "signature.png");

// ---------------------------------------------------------------------------
// Calibrated visual-space layout constants (all in PDF points).
// Derived empirically from a 150dpi raster of the template — see module
// header. "Yv" below is the vertical position of each printed line's
// underline/ruling; text is drawn with its baseline a fixed offset above it.
// ---------------------------------------------------------------------------

const BASELINE_LIFT = 8; // pt: baseline sits this far above a printed rule
const RIGHT_BORDER_XV = 1946.4; // right edge of the printed receipt box
const LEFT_BORDER_XV = 60; // left edge of the printed receipt box
const RIGHT_MARGIN = 20; // breathing room before the right border
const CONTINUATION_INDENT = 80; // left indent for unlabeled continuation lines

const LAYOUT = {
  receiptNo: { xv: 305, yv: 363.4 - BASELINE_LIFT },
  date: { xv: 1614.7, yv: 363.4 - BASELINE_LIFT },

  receivedFrom: {
    line1: { xv: 538.5, yv: 460.3 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - 538.5 },
    line2: { xv: CONTINUATION_INDENT, yv: 531.4 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - CONTINUATION_INDENT },
  },

  amountInWords: {
    line1: { xv: 412.7, yv: 600.0 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - 412.7 },
    line2: { xv: CONTINUATION_INDENT, yv: 670.1 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - CONTINUATION_INDENT },
    line3: { xv: CONTINUATION_INDENT, yv: 739.2 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - CONTINUATION_INDENT },
  },

  paymentMethod: { xv: 534.6, yv: 811.0 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - 534.6 },
  purpose: { xv: 243.3, yv: 879.8 - BASELINE_LIFT, maxWidth: RIGHT_BORDER_XV - RIGHT_MARGIN - 243.3 },

  // Blank interior of the ₹ amount box (left, top, right, bottom in Xv/Yv).
  amountBox: { left: 188.2, top: 1063.2, right: 523.2, bottom: 1165.9 },

  // Blank area above the "Receiver's Signature" caption, sized/centered to
  // roughly match the caption's own horizontal span.
  signatureBox: { left: 1460, top: 1000, right: 1940, bottom: 1190 },
} as const;

const DEFAULT_FONT_SIZE = 20;
const MIN_FONT_SIZE = 10;
const AMOUNT_FONT_SIZE = 40;

// ---------------------------------------------------------------------------
// Coordinate transform + low-level drawing helpers
// ---------------------------------------------------------------------------

function toRaw(xv: number, yv: number, wRaw: number, hRaw: number) {
  return { x: wRaw - yv, y: hRaw - xv };
}

interface DrawCtx {
  page: PDFPage;
  wRaw: number;
  hRaw: number;
  font: PDFFont;
}

function drawVisualText(
  ctx: DrawCtx,
  text: string,
  xv: number,
  yv: number,
  size: number,
  color = rgb(0.05, 0.05, 0.2)
) {
  if (!text) return;
  const raw = toRaw(xv, yv, ctx.wRaw, ctx.hRaw);
  ctx.page.drawText(text, {
    x: raw.x,
    y: raw.y,
    size,
    font: ctx.font,
    color,
    rotate: degrees(270),
  });
}

/** Shrinks font size until `text` fits within `maxWidth`, down to a floor. */
function fitSingleLine(ctx: DrawCtx, text: string, maxWidth: number, startSize = DEFAULT_FONT_SIZE) {
  let size = startSize;
  while (size > MIN_FONT_SIZE && ctx.font.widthOfTextAtSize(text, size) > maxWidth) {
    size -= 1;
  }
  return size;
}

/** Greedy word-wrap of `text` into at most `slots.length` lines, shrinking the
 * font if needed so everything fits; the final line is truncated with an
 * ellipsis if it still overflows at the minimum font size. */
function wrapIntoSlots(
  ctx: DrawCtx,
  text: string,
  slots: { xv: number; yv: number; maxWidth: number }[],
  startSize = DEFAULT_FONT_SIZE
) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return;

  for (let size = startSize; size >= MIN_FONT_SIZE; size--) {
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      const slot = slots[Math.min(lines.length, slots.length - 1)];
      if (ctx.font.widthOfTextAtSize(candidate, size) <= slot.maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
        if (lines.length >= slots.length) break;
      }
    }
    if (current && lines.length < slots.length) lines.push(current);

    const fits =
      lines.length <= slots.length &&
      lines.every((line, i) => ctx.font.widthOfTextAtSize(line, size) <= slots[i].maxWidth);

    if (fits) {
      lines.forEach((line, i) => drawVisualText(ctx, line, slots[i].xv, slots[i].yv, size));
      return;
    }
  }

  // Fallback: didn't fit even at the minimum size — truncate into the slots
  // we have, with an ellipsis on the last one.
  const size = MIN_FONT_SIZE;
  let remaining = text.trim();
  for (let i = 0; i < slots.length && remaining; i++) {
    const slot = slots[i];
    const isLast = i === slots.length - 1;
    let line = remaining;
    if (ctx.font.widthOfTextAtSize(line, size) > slot.maxWidth) {
      while (line.length > 1 && ctx.font.widthOfTextAtSize(line + (isLast ? "…" : ""), size) > slot.maxWidth) {
        line = line.slice(0, -1);
      }
      if (isLast) line += "…";
    }
    drawVisualText(ctx, line, slot.xv, slot.yv, size);
    remaining = isLast ? "" : remaining.slice(line.length).trim();
  }
}

function drawCenteredInBox(
  ctx: DrawCtx,
  text: string,
  box: { left: number; top: number; right: number; bottom: number },
  size: number,
  color = rgb(0, 0, 0)
) {
  const width = ctx.font.widthOfTextAtSize(text, size);
  const boxWidth = box.right - box.left;
  const boxHeight = box.bottom - box.top;
  const xv = box.left + Math.max(0, (boxWidth - width) / 2);
  // Vertically center the text's cap-height roughly within the box; a
  // Helvetica glyph's visual height at `size` is ~0.7 * size.
  const yv = box.top + (boxHeight + size * 0.7) / 2;
  drawVisualText(ctx, text, xv, yv, size, color);
}

async function drawSignatureImage(
  ctx: DrawCtx,
  pdfDoc: PDFDocument,
  box: { left: number; top: number; right: number; bottom: number },
  pngBytes: Uint8Array
) {
  const image = await pdfDoc.embedPng(pngBytes);
  const boxWidth = box.right - box.left;
  const boxHeight = box.bottom - box.top;
  const scale = Math.min(boxWidth / image.width, boxHeight / image.height) * 0.9;
  const width = image.width * scale;
  const height = image.height * scale;

  // Center within the box.
  const xvLeft = box.left + (boxWidth - width) / 2;
  const yvBottom = box.top + (boxHeight + height) / 2; // "bottom" in visual space = larger Yv

  const raw = toRaw(xvLeft, yvBottom, ctx.wRaw, ctx.hRaw);
  ctx.page.drawImage(image, {
    x: raw.x,
    y: raw.y,
    width,
    height,
    rotate: degrees(270),
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function generateReceiptPdf(data: ReceiptData): Promise<Uint8Array> {
  const [templateBytes, signatureBytes] = await Promise.all([
    fs.readFile(TEMPLATE_PATH),
    fs.readFile(SIGNATURE_PATH),
  ]);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const wRaw = page.getWidth();
  const hRaw = page.getHeight();

  // The printed template's labels are bold; draw every overlaid field value
  // in HelveticaBold too so they match the label weight (not just size).
  const ctx: DrawCtx = { page, wRaw, hRaw, font: boldFont };
  const boldCtx: DrawCtx = { page, wRaw, hRaw, font: boldFont };

  // Receipt No. / Date
  drawVisualText(ctx, data.receiptNo, LAYOUT.receiptNo.xv, LAYOUT.receiptNo.yv, DEFAULT_FONT_SIZE);
  drawVisualText(ctx, data.date, LAYOUT.date.xv, LAYOUT.date.yv, DEFAULT_FONT_SIZE);

  // Received with thanks from (donor name) — wraps across its 2 lines.
  wrapIntoSlots(ctx, data.receivedFrom, [LAYOUT.receivedFrom.line1, LAYOUT.receivedFrom.line2]);

  // The sum of Rupees (amount in words) — wraps across its 3 lines.
  wrapIntoSlots(ctx, data.amountInWords, [
    LAYOUT.amountInWords.line1,
    LAYOUT.amountInWords.line2,
    LAYOUT.amountInWords.line3,
  ]);

  // by Cash/Cheque/Draft No. (payment method) — single line, shrink-to-fit.
  const paymentSize = fitSingleLine(ctx, data.paymentMethod, LAYOUT.paymentMethod.maxWidth);
  drawVisualText(ctx, data.paymentMethod, LAYOUT.paymentMethod.xv, LAYOUT.paymentMethod.yv, paymentSize);

  // Purpose — single line, shrink-to-fit.
  const purposeSize = fitSingleLine(ctx, data.purpose, LAYOUT.purpose.maxWidth);
  drawVisualText(ctx, data.purpose, LAYOUT.purpose.xv, LAYOUT.purpose.yv, purposeSize);

  // Numeric amount, centered in the ₹ box, bold.
  drawCenteredInBox(boldCtx, data.amountNumber, LAYOUT.amountBox, AMOUNT_FONT_SIZE);

  // Signature image, centered above the "Receiver's Signature" caption.
  await drawSignatureImage(ctx, pdfDoc, LAYOUT.signatureBox, signatureBytes);

  return pdfDoc.save();
}
