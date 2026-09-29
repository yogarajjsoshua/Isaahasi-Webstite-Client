import React, { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import type { DonationData, DonorInfo } from '../../types';
import { paymentService } from '../../services/paymentService';
import { formService } from '../../services/formService';
import './DonateModal.css';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'once' | 'monthly';

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('once');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState<DonorInfo>({
    fullName: '',
    email: '',
    mobileNumber: '',
    address: '',
    nationality: 'indian',
    panNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DonorInfo, string>>>({});

  const predefinedAmounts = [500, 1000, 2500, 5000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setCustomAmount(value);
    setSelectedAmount(numValue);
  };

  const handleInputChange = (field: keyof DonorInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DonorInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formService.validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!formService.validatePhone(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.nationality === 'indian' && formData.panNumber) {
      if (!paymentService.validatePAN(formData.panNumber)) {
        newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
      }
    }

    if (selectedAmount === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select or enter a donation amount' });
      return false;
    }

    if (!paymentService.validateAmount(selectedAmount)) {
      setSubmitMessage({ type: 'error', text: 'Invalid donation amount' });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const donationData: DonationData = {
        amount: selectedAmount,
        type: activeTab,
        donor: formData,
      };

      await paymentService.initiateDonation(donationData);

      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your donation! (Stage 1: No payment processing yet)'
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveTab('once');
    setSelectedAmount(0);
    setCustomAmount('');
    setFormData({
      fullName: '',
      email: '',
      mobileNumber: '',
      address: '',
      nationality: 'indian',
      panNumber: '',
    });
    setErrors({});
    setSubmitMessage(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="donate-modal">
      <div className="donate-modal-content">
        <h2 className="donate-modal-title">Make a Donation</h2>

        <div className="donate-tabs">
          <button
            className={`donate-tab ${activeTab === 'once' ? 'donate-tab--active' : ''}`}
            onClick={() => setActiveTab('once')}
          >
            Donate Once
          </button>
          <button
            className={`donate-tab ${activeTab === 'monthly' ? 'donate-tab--active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Donate Monthly
          </button>
        </div>

        <form onSubmit={handleSubmit} className="donate-form">
          <div className="donate-amounts">
            <label className="donate-label">Select Amount (₹)</label>
            <div className="donate-amount-buttons">
              {predefinedAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  className={`donate-amount-button ${selectedAmount === amount && !customAmount ? 'donate-amount-button--active' : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  ₹{amount.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="donate-custom-amount">
              <Input
                id="custom-amount"
                name="customAmount"
                type="text"
                label="Or Enter Custom Amount"
                placeholder="Enter amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="donate-fields">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              error={errors.fullName}
              autoComplete="name"
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              autoComplete="email"
              inputMode="email"
            />

            <Input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              label="Mobile Number"
              placeholder="+91 XXXXXXXXXX"
              required
              value={formData.mobileNumber}
              onChange={(value) => handleInputChange('mobileNumber', value)}
              error={errors.mobileNumber}
              autoComplete="tel"
              inputMode="tel"
            />

            <Input
              id="address"
              name="address"
              label="Address"
              required
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              error={errors.address}
              autoComplete="street-address"
            />

            <div className="donate-nationality">
              <label className="donate-label">Nationality *</label>
              <div className="donate-radio-group">
                <label className="donate-radio">
                  <input
                    type="radio"
                    name="nationality"
                    value="indian"
                    checked={formData.nationality === 'indian'}
                    onChange={(e) => handleInputChange('nationality', e.target.value as 'indian' | 'non-indian')}
                  />
                  <span>Indian</span>
                </label>
                <label className="donate-radio">
                  <input
                    type="radio"
                    name="nationality"
                    value="non-indian"
                    checked={formData.nationality === 'non-indian'}
                    onChange={(e) => handleInputChange('nationality', e.target.value as 'indian' | 'non-indian')}
                  />
                  <span>Non-Indian</span>
                </label>
              </div>
            </div>

            {formData.nationality === 'indian' && (
              <Input
                id="panNumber"
                name="panNumber"
                label="PAN Number"
                placeholder="ABCDE1234F"
                value={formData.panNumber || ''}
                onChange={(value) => handleInputChange('panNumber', value.toUpperCase())}
                error={errors.panNumber}
                maxLength={10}
                autoComplete="off"
                pattern="[A-Z]{5}[0-9]{4}[A-Z]"
              />
            )}
          </div>

          {submitMessage && (
            <div className={`donate-message donate-message--${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="donate-actions">
            <Button type="submit" variant="primary" size="large" loading={loading}>
              {loading ? 'Processing…' : `Donate ₹${selectedAmount.toLocaleString()}`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
