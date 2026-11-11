import type { FormSubmission } from '../types';

export const MESSAGE_MIN_WORDS = 80;
export const MESSAGE_MAX_WORDS = 100;

export class FormService {
  /**
   * Submit a form to the backend API, which records the submission
   * in the Google Sheets-backed form store.
   */
  async submit(submission: FormSubmission): Promise<void> {
    const response = await fetch('/api/forms/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to submit form';
      try {
        const body = await response.json();
        if (body?.error) errorMessage = body.error;
      } catch {
        // response had no JSON body; keep default message
      }
      throw new Error(errorMessage);
    }
  }

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  /**
   * Returns the 10-digit Indian mobile number (starts with 6-9), or null if invalid.
   * Accepts optional +91 / 0 prefix and spaces, dashes, brackets.
   */
  normalizePhone(phone: string): string | null {
    let digits = phone.replace(/[\s\-()]/g, '');
    if (!/^\+?\d+$/.test(digits)) return null;
    digits = digits.replace(/^\+/, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
  }

  validatePhone(phone: string): boolean {
    return this.normalizePhone(phone) !== null;
  }

  validateName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100 && /\p{L}/u.test(trimmed);
  }

  countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  /** Returns an error message, or null when the message length is acceptable. */
  validateMessage(text: string): string | null {
    const words = this.countWords(text);
    if (words === 0) return 'This field is required';
    if (words < MESSAGE_MIN_WORDS) return `Please write at least ${MESSAGE_MIN_WORDS} words (currently ${words})`;
    if (words > MESSAGE_MAX_WORDS) return `Please keep it within ${MESSAGE_MAX_WORDS} words (currently ${words})`;
    return null;
  }
}

export const formService = new FormService();
