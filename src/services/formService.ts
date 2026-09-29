import type { FormSubmission } from '../types';

export class FormService {
  /**
   * Submit a form
   * Stage 1: Console log only (no backend)
   * Stage 2: Will integrate with Google Sheets API
   */
  async submit(submission: FormSubmission): Promise<void> {
    console.log('Form submission (Stage 1 - no backend):', submission);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 2 will implement:
    // - Google Sheets API integration
    // - Email notifications
    // - Data validation

    return Promise.resolve();
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
