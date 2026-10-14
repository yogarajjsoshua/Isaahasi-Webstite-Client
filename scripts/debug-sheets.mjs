import { google } from "googleapis";

const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const key = rawKey?.replace(/\\n/g, "\n");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

console.log("email:", email);
console.log("spreadsheetId length:", spreadsheetId?.length);
console.log("rawKey first/last 10:", JSON.stringify(rawKey?.slice(0, 10)), JSON.stringify(rawKey?.slice(-10)));
console.log("key starts with BEGIN:", key?.startsWith("-----BEGIN PRIVATE KEY-----"));
console.log("key ends with END+newline:", JSON.stringify(key?.slice(-30)));

const auth = new google.auth.JWT({
  email,
  key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

try {
  await auth.authorize();
  console.log("AUTH OK");
} catch (err) {
  console.error("AUTH FAILED:", err.message);
  process.exit(1);
}

const sheets = google.sheets({ version: "v4", auth });

try {
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  console.log(
    "Sheet tabs:",
    res.data.sheets.map((s) => s.properties.title)
  );
} catch (err) {
  console.error("SPREADSHEET GET FAILED:", err.message);
  process.exit(1);
}

try {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Newsletter!A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [["debug-script-test", "debug@example.com"]] },
  });
  console.log("APPEND OK");
} catch (err) {
  console.error("APPEND FAILED:", err.message);
  process.exit(1);
}
