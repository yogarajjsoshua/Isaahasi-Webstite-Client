import type { DonationData } from '../types';

export class PaymentService {
  /**
   * Initiate a donation
   * Stage 1: Console log only (no payment processing)
   * Stage 3: Will integrate with Razorpay
   */
  async initiateDonation(data: DonationData): Promise<void> {
    console.log('Donation initiated (Stage 1 - no payment):', data);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stage 3 will implement:
    // - Razorpay SDK setup
    // - Payment gateway integration
    // - Success/failure handling
    // - Receipt generation

    return Promise.resolve();
  }

  /**
   * Validate PAN number format (India)
   * Format: ABCDE1234F
   */
  validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(pan);
  }

  /**
   * Validate donation amount
   */
  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Max 10 lakhs
  }
}

export const paymentService = new PaymentService();
