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
// sequences in place of real newlines; unescape before handing it to the
// JWT client, or auth will fail.
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n"
);
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
