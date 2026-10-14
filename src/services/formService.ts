import type { FormSubmission } from '../types';

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

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

export const formService = new FormService();
