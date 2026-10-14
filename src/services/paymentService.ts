import type { DonationData } from '../types';
import type {
  RazorpayCheckoutResponse,
  RazorpaySubscriptionCheckoutResponse,
} from '../types/razorpay';

export type DonationStatus =
  | 'idle'
  | 'creating'
  | 'opening'
  | 'processing'
  | 'verifying'
  | 'success'
  | 'cancelled'
  | 'failure';

export type DonationStatusListener = (status: DonationStatus, errorMessage?: string) => void;

const GENERIC_ERROR_MESSAGE = 'Something went wrong while processing your donation. Please try again.';

export class PaymentService {
  async initiateDonation(data: DonationData, onStatusChange?: DonationStatusListener): Promise<void> {
    const notify: DonationStatusListener = (status, message) => onStatusChange?.(status, message);

    if (typeof window === 'undefined' || !window.Razorpay) {
      notify('failure', GENERIC_ERROR_MESSAGE);
      return;
    }

    notify('creating');

    try {
      if (data.type === 'once') {
        await this.payOnce(data, notify);
      } else {
        await this.payMonthly(data, notify);
      }
    } catch (err) {
      console.error('initiateDonation failed', err);
      notify('failure', GENERIC_ERROR_MESSAGE);
    }
  }

  private async payOnce(data: DonationData, notify: DonationStatusListener): Promise<void> {
    const createResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: data.amount,
        type: 'once',
        donor: {
          fullName: data.donor.fullName,
          email: data.donor.email,
          mobileNumber: data.donor.mobileNumber,
          address: data.donor.address,
          nationality: data.donor.nationality,
          panNumber: data.donor.panNumber,
        },
      }),
    });

    if (!createResponse.ok) {
      notify('failure', GENERIC_ERROR_MESSAGE);
      return;
    }

    const { orderId, amount, currency, keyId } = await createResponse.json();

    notify('opening');

    let settled = false;

    const razorpay = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      order_id: orderId,
      name: 'iSaahasi Academy India Foundation',
      description: 'Donation',
      prefill: {
        name: data.donor.fullName,
        email: data.donor.email,
        contact: data.donor.mobileNumber,
      },
      theme: { color: '#5a8b86' },
      handler: (response: RazorpayCheckoutResponse) => {
        settled = true;
        void this.verifyOnce(response, data, notify);
      },
      modal: {
        ondismiss: () => {
          if (!settled) {
            notify('cancelled');
          }
        },
      },
    });

    notify('processing');
    razorpay.open();
  }

  private async verifyOnce(
    response: RazorpayCheckoutResponse,
    data: DonationData,
    notify: DonationStatusListener,
  ): Promise<void> {
    notify('verifying');

    try {
      const verifyResponse = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...response,
          // Donor context for the donation receipt PDF (api/receipts/generate.ts),
          // generated server-side right after signature verification.
          donorName: data.donor.fullName,
          donorEmail: data.donor.email,
          amount: data.amount,
          purpose: 'Donation',
        }),
      });

      if (!verifyResponse.ok) {
        notify('failure', GENERIC_ERROR_MESSAGE);
        return;
      }

      const { verified } = await verifyResponse.json();
      notify(verified ? 'success' : 'failure', verified ? undefined : GENERIC_ERROR_MESSAGE);
    } catch (err) {
      console.error('verifyOnce failed', err);
      notify('failure', GENERIC_ERROR_MESSAGE);
    }
  }

  private async payMonthly(data: DonationData, notify: DonationStatusListener): Promise<void> {
    const createResponse = await fetch('/api/payments/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: data.amount,
        type: 'monthly',
        donor: {
          fullName: data.donor.fullName,
          email: data.donor.email,
          mobileNumber: data.donor.mobileNumber,
          address: data.donor.address,
          nationality: data.donor.nationality,
          panNumber: data.donor.panNumber,
        },
      }),
    });

    if (!createResponse.ok) {
      notify('failure', GENERIC_ERROR_MESSAGE);
      return;
    }

    const { subscriptionId, keyId } = await createResponse.json();

    notify('opening');

    let settled = false;

    const razorpay = new window.Razorpay({
      key: keyId,
      subscription_id: subscriptionId,
      recurring: true,
      name: 'iSaahasi Academy India Foundation',
      description: 'Monthly donation',
      prefill: {
        name: data.donor.fullName,
        email: data.donor.email,
        contact: data.donor.mobileNumber,
      },
      theme: { color: '#5a8b86' },
      handler: (response: RazorpaySubscriptionCheckoutResponse) => {
        settled = true;
        void this.verifyMonthly(response, notify);
      },
      modal: {
        ondismiss: () => {
          if (!settled) {
            notify('cancelled');
          }
        },
      },
    });

    notify('processing');
    razorpay.open();
  }

  private async verifyMonthly(
    response: RazorpaySubscriptionCheckoutResponse,
    notify: DonationStatusListener,
  ): Promise<void> {
    notify('verifying');

    try {
      const verifyResponse = await fetch('/api/payments/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });

      if (!verifyResponse.ok) {
        notify('failure', GENERIC_ERROR_MESSAGE);
        return;
      }

      const { verified } = await verifyResponse.json();
      notify(verified ? 'success' : 'failure', verified ? undefined : GENERIC_ERROR_MESSAGE);
    } catch (err) {
      console.error('verifyMonthly failed', err);
      notify('failure', GENERIC_ERROR_MESSAGE);
    }
  }

  validatePAN(pan: string): boolean {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(pan);
  }

  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Max 10 lakhs
  }
}

export const paymentService = new PaymentService();
