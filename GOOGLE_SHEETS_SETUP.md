# Google Sheets Form Submission — Setup

The `api/forms/submit.ts` serverless function writes volunteer, partner, and
newsletter form submissions directly to a Google Sheet using the
[`googleapis`](https://www.npmjs.com/package/googleapis) npm package and a
Google Cloud **service account** (JWT auth) — no third-party relay service is
involved. Follow these steps once per environment (local + Vercel).

## 1. Create the spreadsheet and tabs

1. Create a Google Sheet (or reuse one) in your own Google account.
2. Create three tabs (sheet names are case-sensitive, exactly as below) with
   a header row matching these column names exactly:
   - `Volunteer` — columns: `Timestamp`, `Full Name`, `Email`, `Mobile Number`, `Message`
   - `Partner` — columns: `Timestamp`, `Full Name`, `Organisation Name`, `Email`, `Mobile Number`, `Message`
   - `Newsletter` — columns: `Timestamp`, `Email`

## 2. Create a Google Cloud project and enable the Sheets API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create a new project (or reuse an existing one).
2. With that project selected, open **APIs & Services → Library**, search
   for **Google Sheets API**, and click **Enable**.

## 3. Create a service account and download its key

1. Open **APIs & Services → Credentials → Create Credentials → Service
   account**.
2. Give it a name (e.g. `isaahasi-forms-writer`) and finish creating it —
   no project-level roles are needed, since access is granted directly on
   the sheet in the next step.
3. Open the new service account, go to the **Keys** tab, and click **Add
   Key → Create new key**, choosing **JSON**. This downloads a JSON key
   file — keep it private; it is a credential, not something to commit to
   the repo.

## 4. Share the spreadsheet with the service account

This step is easy to miss and the most common cause of "permission denied"
errors later:

1. Open the downloaded JSON key file and copy the `client_email` field
   (it looks like `<name>@<project-id>.iam.gserviceaccount.com`).
2. Open the Google Sheet from step 1, click **Share**, paste that email
   address, and give it **Editor** access.

Without this share step, the service account can authenticate but Google
Sheets will reject every read/write with a permissions error.

## 5. Extract the credentials

From the downloaded JSON key file, you need two fields, plus the
spreadsheet ID:

| Env var | Source |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | the key file's `client_email` field |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | the key file's `private_key` field |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | the sheet's URL — the long ID segment between `/d/` and `/edit` |

The `private_key` field in the JSON file is a multi-line PEM block, but a
`.env` value has to be a single line. When you paste it into `.env.local`,
Vercel's Environment Variables UI, or a secrets manager, represent each
newline as a literal `\n` escape sequence (most of these tools handle a
pasted multi-line value this way automatically). The app code reverses this
at runtime with:

```ts
privateKey.replace(/\\n/g, '\n')
```

before handing it to the Google Auth client — if that unescape step is
missing or the key was pasted with real line breaks preserved incorrectly,
authentication will fail.

## 6. Set environment variables

Add these to `.env.local` for local development, **and** to the Vercel
project's Environment Variables settings for deployed environments:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from the JSON key>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=<the long ID segment from the sheet's URL>
```

## 7. Verify

Call the endpoint with a test payload, e.g.:

```
curl -X POST http://localhost:3000//api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{"type":"newsletter","data":{"email":"yjoshuak@gmail.com"}}'
```

A new row should appear in the `Newsletter` tab, and the response should be
`{"success":true}`.
