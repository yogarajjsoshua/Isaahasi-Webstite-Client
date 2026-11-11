import { appendFormRow } from '../_lib/sheets.js';
import {
  MESSAGE_MAX_WORDS,
  MESSAGE_MIN_WORDS,
  countWords,
  isValidEmail,
  isValidName,
  normalizeIndianMobile,
} from '../_lib/validation.js';

type FormType = 'volunteer' | 'partner' | 'newsletter';

interface SubmitFormBody {
  type: FormType;
  data: Record<string, string>;
}

const ALLOWED_TYPES: FormType[] = ['volunteer', 'partner', 'newsletter'];

const REQUIRED_FIELDS: Record<FormType, string[]> = {
  volunteer: ['fullName', 'email', 'mobileNumber', 'message'],
  partner: ['fullName', 'organisationName', 'email', 'mobileNumber', 'message'],
  newsletter: ['email'],
};

const SHEET_NAMES: Record<FormType, string> = {
  volunteer: 'Volunteer',
  partner: 'Partner',
  newsletter: 'Newsletter',
};

function buildRow(type: FormType, data: Record<string, string>): Record<string, string> {
  const timestamp = new Date().toISOString();

  switch (type) {
    case 'volunteer':
      return {
        Timestamp: timestamp,
        'Full Name': data.fullName,
        Email: data.email,
        'Mobile Number': data.mobileNumber,
        Message: data.message,
      };
    case 'partner':
      return {
        Timestamp: timestamp,
        'Full Name': data.fullName,
        'Organisation Name': data.organisationName,
        Email: data.email,
        'Mobile Number': data.mobileNumber,
        Message: data.message,
      };
    case 'newsletter':
      return { Timestamp: timestamp, Email: data.email };
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitFormBody;
  const { type, data } = body;

  if (!type || !ALLOWED_TYPES.includes(type)) {
    return Response.json({ error: 'Invalid form type' }, { status: 400 });
  }

  if (!data || typeof data !== 'object') {
    return Response.json({ error: 'Missing form data' }, { status: 400 });
  }

  const requiredFields = REQUIRED_FIELDS[type];
  const missingField = requiredFields.find(
    (field) => typeof data[field] !== 'string' || data[field].trim() === ''
  );
  if (missingField) {
    return Response.json({ error: `Missing or invalid field: ${missingField}` }, { status: 400 });
  }

  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') cleaned[key] = value.trim();
  }

  if (!isValidEmail(cleaned.email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  if (type !== 'newsletter') {
    if (!isValidName(cleaned.fullName)) {
      return Response.json({ error: 'Invalid full name' }, { status: 400 });
    }
    const mobile = normalizeIndianMobile(cleaned.mobileNumber);
    if (!mobile) {
      return Response.json({ error: 'Invalid mobile number' }, { status: 400 });
    }
    cleaned.mobileNumber = mobile;

    const words = countWords(cleaned.message);
    if (words < MESSAGE_MIN_WORDS || words > MESSAGE_MAX_WORDS) {
      return Response.json(
        { error: `Message must be ${MESSAGE_MIN_WORDS}-${MESSAGE_MAX_WORDS} words` },
        { status: 400 }
      );
    }
  }

  if (type === 'partner' && cleaned.organisationName.length < 2) {
    return Response.json({ error: 'Invalid organisation name' }, { status: 400 });
  }

  try {
    await appendFormRow(SHEET_NAMES[type], buildRow(type, cleaned));

    return Response.json({ success: true });
  } catch (err) {
    console.error('forms/submit google sheets append failed', err);
    return Response.json({ error: 'Could not record submission' }, { status: 502 });
  }
}
