/**
 * Google Sheets append helper.
 *
 * Writes a single row to a named tab in the project's Google Sheet using
 * the Google Sheets API (v4) directly — no third-party relay service.
 * Auth is a Google Cloud service account via JWT, scoped read/write to
 * Sheets only. See GOOGLE_SHEETS_SETUP.md for how to provision the
 * service account, share the sheet with it, and set the env vars below.
 */

import { google } from "googleapis";

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
// The PEM key arrives as a single-line env var with literal "\n" escape
// sequences in place of real newlines. Unescape them, and strip any wrapping
// quotes and stray CRs that dashboards add when the value is pasted, or
// OpenSSL rejects the key with ERR_OSSL_UNSUPPORTED.
function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) {
    return raw;
  }
  return raw
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "");
}

const SERVICE_ACCOUNT_PRIVATE_KEY = normalizePrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

const SHEETS_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: SHEETS_SCOPES,
  });

  return google.sheets({ version: "v4", auth });
}

/**
 * Appends `row` as a new row to `sheetName`. The row's values are taken in
 * `Object.values(row)` order, so callers must build `row` with keys already
 * in the sheet's left-to-right header order (plain object literals preserve
 * string-key insertion order in JS).
 *
 * Throws on any failure (missing env vars, auth failure, API error) — the
 * caller is responsible for catching and mapping to an HTTP response.
 */
export async function appendFormRow(sheetName: string, row: Record<string, string>): Promise<void> {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [Object.values(row)],
    },
  });
}

/**
 * Checks whether `column` in `sheetName` already contains `value` in any row —
 * used for webhook idempotency checks, since Razorpay redelivers events on
 * timeout or non-2xx responses.
 *
 * Returns `false` (instead of throwing) when the column is empty, no row
 * matches, or the sheet/tab doesn't exist yet (a 400 "Unable to parse range"
 * style error from the Sheets API), so this is safe to call before the
 * target tab has ever been created. Any other error (auth failure, network
 * error, etc.) still throws, same as `appendFormRow`.
 */
export async function columnContainsValue(sheetName: string, column: string, value: string): Promise<boolean> {
  const sheets = getSheetsClient();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${column}:${column}`,
    });

    const values = response.data.values;
    if (!values) {
      return false;
    }

    return values.some((row) => row[0] === value);
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 400) {
      return false;
    }
    throw error;
  }
}

export interface SheetRow {
  /** 1-based row number in the sheet (row 1 is the header). */
  rowNumber: number;
  values: string[];
}

/**
 * Returns every data row of `sheetName` (header row excluded) with its sheet
 * row number. Returns [] when the tab doesn't exist yet (400 from the API).
 */
export async function getRows(sheetName: string): Promise<SheetRow[]> {
  const sheets = getSheetsClient();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const all = response.data.values ?? [];
    return all.slice(1).map((values, index) => ({
      rowNumber: index + 2,
      values: values.map((cell) => String(cell ?? "")),
    }));
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 400) {
      return [];
    }
    throw error;
  }
}

/**
 * Overwrites a single cell. Used instead of rewriting the whole row so a
 * concurrent edit to other columns isn't clobbered.
 */
export async function updateCell(
  sheetName: string,
  rowNumber: number,
  column: string,
  value: string
): Promise<void> {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${column}${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: { values: [[value]] },
  });
}

/** Reads a single cell; returns "" when it is empty. */
export async function getCell(sheetName: string, rowNumber: number, column: string): Promise<string> {
  const sheets = getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${column}${rowNumber}`,
  });

  return String(response.data.values?.[0]?.[0] ?? "");
}

/**
 * Deletes whole rows from `sheetName`. Rows are removed highest-first in one
 * batchUpdate so earlier deletions can't shift the numbers of later ones.
 */
export async function deleteRows(sheetName: string, rowNumbers: number[]): Promise<void> {
  if (rowNumbers.length === 0) {
    return;
  }

  const sheets = getSheetsClient();

  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets.properties(sheetId,title)",
  });
  const sheetId = meta.data.sheets?.find((s) => s.properties?.title === sheetName)?.properties?.sheetId;
  if (sheetId == null) {
    throw new Error(`deleteRows: tab "${sheetName}" not found`);
  }

  const unique = [...new Set(rowNumbers)].sort((a, b) => b - a);

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: unique.map((rowNumber) => ({
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: rowNumber - 1,
            endIndex: rowNumber,
          },
        },
      })),
    },
  });
}
