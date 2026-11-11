import React, { useState } from 'react';
import './DonateModal.css';
import { paymentService, type DonationStatus } from '../services/paymentService';
import { formService } from '../services/formService';
import imgRectangle20 from '../assets/images/donate/hero-bg.webp';
import imgMaterialSymbolsClose from '../assets/icons/donate/close.svg';

type DonateModalProps = {
  onClose: () => void;
};

const BUSY_STATUSES: DonationStatus[] = ['creating', 'opening', 'processing', 'verifying'];

export const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [nationality, setNationality] = useState<'indian' | 'non-indian'>('indian');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    pan: ''
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<DonationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presetAmounts = [500, 1000, 5000];
  const isBusy = BUSY_STATUSES.includes(status);

  const clearError = (field: string) => {
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (amount: number): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (selectedAmount === null && customAmount.trim() === '') {
      errs.amount = 'Please choose or enter a donation amount';
    } else if (!paymentService.validateAmount(amount)) {
      errs.amount = 'Enter a valid amount between ₹1 and ₹10,00,000';
    }

    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    else if (!formService.validateName(formData.fullName)) errs.fullName = 'Enter a valid name (at least 2 characters)';

    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!formService.validateEmail(formData.email)) errs.email = 'Invalid email format';

    if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
    else if (!formService.validatePhone(formData.mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number';

    if (!formData.address.trim()) errs.address = 'Address is required';
    else if (formData.address.trim().length < 5) errs.address = 'Enter your complete address';

    if (!formData.pan.trim()) errs.pan = 'PAN number is required';
    else if (!paymentService.validatePAN(formData.pan.trim().toUpperCase())) errs.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = selectedAmount ?? Number(customAmount);

    const errs = validate(amount);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setErrorMessage(null);
      setStatus('idle');
      return;
    }

    setErrorMessage(null);

    await paymentService.initiateDonation(
      {
        amount,
        type: selectedTab,
        donor: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobileNumber: formService.normalizePhone(formData.mobile) ?? formData.mobile,
          address: formData.address.trim(),
          nationality,
          panNumber: formData.pan.trim().toUpperCase(),
        },
      },
      (nextStatus, message) => {
        setStatus(nextStatus);
        setErrorMessage(message ?? null);
      },
    );
  };

  if (status === 'success') {
    return (
      <div className="donate-modal-overlay" onClick={onClose}>
        <div className="donate-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="donate-modal-left">
            <div className="donate-modal-image-overlay">
              <img src={imgRectangle20} alt="" className="donate-modal-bg-image" />
              <div className="donate-modal-gradient"></div>
            </div>
            <div className="donate-modal-hero-content">
              <h1 className="donate-modal-hero-title">
                THANK<br />
                YOU<br />
                FOR GIVING
              </h1>
            </div>
          </div>
          <div className="donate-modal-right">
            <button className="donate-modal-close" onClick={onClose} aria-label="Close modal">
              <img src={imgMaterialSymbolsClose} alt="Close" />
            </button>
            <div className="donate-success-content">
              <p className="donate-success-message">
                Your donation was successful. A confirmation has been sent to your email and mobile number.
              </p>
              <button type="button" className="donate-submit-btn" onClick={onClose}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-modal-overlay" onClick={onClose}>
      <div className="donate-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Side - Hero Image */}
        <div className="donate-modal-left">
          <div className="donate-modal-image-overlay">
            <img src={imgRectangle20} alt="" className="donate-modal-bg-image" />
            <div className="donate-modal-gradient"></div>
          </div>
          <div className="donate-modal-hero-content">
            <h1 className="donate-modal-hero-title">
              MAKE A<br />
              DIFFERENCE<br />
              TODAY
            </h1>
            <p className="donate-modal-hero-description">
              You can choose to be a part of Her Journey of freedom. Your contribution will support the women in their education, health care, skill development, counselling and much more
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="donate-modal-right">
          <button
            className="donate-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <img src={imgMaterialSymbolsClose} alt="Close" />
          </button>

          {/* Tabs */}
          <div className="donate-modal-tabs">
            <button
              className={`donate-modal-tab ${selectedTab === 'once' ? 'donate-modal-tab--active' : ''}`}
              onClick={() => setSelectedTab('once')}
              disabled={isBusy}
            >
              DONATE ONCE
            </button>
            <button
              className={`donate-modal-tab ${selectedTab === 'monthly' ? 'donate-modal-tab--active' : ''}`}
              onClick={() => setSelectedTab('monthly')}
              disabled={isBusy}
            >
              DONATE MONTHLY
            </button>
          </div>

          <form onSubmit={handleSubmit} className="donate-modal-form" noValidate>
            {/* Amount Selection */}
            <div className="donate-form-section">
              <label className="donate-form-label">Choose an Amount *</label>
              <div className="donate-amount-options">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`donate-amount-btn ${selectedAmount === amount ? 'donate-amount-btn--selected' : ''}`}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount(String(amount));
                      clearError('amount');
                    }}
                  disabled={isBusy}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <div className="donate-custom-amount-wrapper">
                <div className="donate-currency-prefix">₹</div>
                <input
                  type="number"
                  min={1}
                  max={1000000}
                  placeholder="Enter custom amount"
                  className="donate-custom-amount-input"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                    clearError('amount');
                  }}
                  disabled={isBusy}
                />
              </div>
              {fieldErrors.amount && <p className="donate-form-error">{fieldErrors.amount}</p>}
            </div>

            {/* Full Name */}
            <div className="donate-form-section">
              <label className="donate-form-label">Enter Full Name *</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="donate-form-input"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  clearError('fullName');
                }}
                disabled={isBusy}
              />
              {fieldErrors.fullName && <p className="donate-form-error">{fieldErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="donate-form-section">
              <label className="donate-form-label">Enter Email Address *</label>
              <input
                type="email"
                placeholder="Enter Email ID"
                className="donate-form-input"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearError('email');
                }}
                disabled={isBusy}
              />
              {fieldErrors.email && <p className="donate-form-error">{fieldErrors.email}</p>}
            </div>

            {/* Mobile */}
            <div className="donate-form-section">
              <label className="donate-form-label">Mobile Number *</label>
              <div className="donate-mobile-input-wrapper">
                <div className="donate-country-code">+91</div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  autoComplete="tel-national"
                  placeholder="Enter Mobile Number"
                  className="donate-form-input donate-form-input--mobile"
                  value={formData.mobile}
                  onChange={(e) => {
                    setFormData({ ...formData, mobile: e.target.value });
                    clearError('mobile');
                  }}
                  disabled={isBusy}
                />
              </div>
              {fieldErrors.mobile && <p className="donate-form-error">{fieldErrors.mobile}</p>}
              <p className="donate-form-note">All Donation updates will be sent through this number*</p>
            </div>

            {/* Address */}
            <div className="donate-form-section">
              <label className="donate-form-label">Address *</label>
              <input
                type="text"
                className="donate-form-input"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  clearError('address');
                }}
                disabled={isBusy}
              />
              {fieldErrors.address && <p className="donate-form-error">{fieldErrors.address}</p>}
            </div>

            {/* Nationality */}
            <div className="donate-form-section">
              <label className="donate-form-label">Nationality *</label>
              <div className="donate-radio-group">
                <label className="donate-radio-label">
                  <input
                    type="radio"
                    name="nationality"
                    value="indian"
                    checked={nationality === 'indian'}
                    onChange={() => setNationality('indian')}
                    className="donate-radio-input"
                    disabled={isBusy}
                  />
                  <span className="donate-radio-text">I'm an Indian national</span>
                </label>
                <label className="donate-radio-label">
                  <input
                    type="radio"
                    name="nationality"
                    value="non-indian"
                    checked={nationality === 'non-indian'}
                    onChange={() => setNationality('non-indian')}
                    className="donate-radio-input"
                    disabled={isBusy}
                  />
                  <span className="donate-radio-text">I'm not an Indian national</span>
                </label>
              </div>
            </div>

            {/* PAN Number */}
            <div className="donate-form-section">
              <label className="donate-form-label">Enter PAN Number *</label>
              <input
                type="text"
                className="donate-form-input"
                maxLength={10}
                autoCapitalize="characters"
                value={formData.pan}
                onChange={(e) => {
                  setFormData({ ...formData, pan: e.target.value });
                  clearError('pan');
                }}
                disabled={isBusy}
              />
              {fieldErrors.pan && <p className="donate-form-error">{fieldErrors.pan}</p>}
            </div>

            {status === 'failure' && errorMessage && (
              <p className="donate-form-error">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button type="submit" className="donate-submit-btn" disabled={isBusy}>
              {isBusy ? 'PLEASE WAIT…' : 'DONATE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
