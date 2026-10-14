import { appendFormRow } from '../_lib/sheets';

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

  try {
    await appendFormRow(SHEET_NAMES[type], buildRow(type, data));

    return Response.json({ success: true });
  } catch (err) {
    console.error('forms/submit google sheets append failed', err);
    return Response.json({ error: 'Could not record submission' }, { status: 502 });
  }
}
