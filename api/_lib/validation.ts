export const MESSAGE_MIN_WORDS = 80;
export const MESSAGE_MAX_WORDS = 100;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// Returns the 10-digit Indian mobile number (starts with 6-9), or null if invalid.
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[\s\-()]/g, '');
  if (!/^\+?\d+$/.test(digits)) return null;
  digits = digits.replace(/^\+/, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100 && /\p{L}/u.test(trimmed);
}

export function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim().toUpperCase());
}

export const MAX_DONATION_AMOUNT = 1000000;

export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && Number.isFinite(amount) && amount >= 1 && amount <= MAX_DONATION_AMOUNT;
}

export interface DonorInput {
  fullName?: unknown;
  email?: unknown;
  mobileNumber?: unknown;
  address?: unknown;
  nationality?: unknown;
  panNumber?: unknown;
}

// Returns an error message, or null when the donor details are acceptable.
export function validateDonor(donor: DonorInput | undefined): string | null {
  if (!donor || typeof donor !== 'object') return 'Missing donor details';
  const { fullName, email, mobileNumber, address, panNumber } = donor;
  if (typeof fullName !== 'string' || !isValidName(fullName)) return 'Invalid full name';
  if (typeof email !== 'string' || !isValidEmail(email)) return 'Invalid email address';
  if (typeof mobileNumber !== 'string' || !normalizeIndianMobile(mobileNumber)) return 'Invalid mobile number';
  if (typeof address !== 'string' || address.trim().length < 5) return 'Invalid address';
  if (typeof panNumber !== 'string' || !isValidPAN(panNumber)) return 'Invalid PAN number';
  return null;
}
