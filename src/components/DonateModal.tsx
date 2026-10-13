import React, { useState } from 'react';
import './DonateModal.css';
import { paymentService, type DonationStatus } from '../services/paymentService';
import imgRectangle20 from '../assets/images/donate/hero-bg.jpg';
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

  const [status, setStatus] = useState<DonationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const presetAmounts = [500, 1000, 5000];
  const isBusy = BUSY_STATUSES.includes(status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = selectedAmount ?? Number(customAmount);

    if (!paymentService.validateAmount(amount)) {
      setErrorMessage('Please enter a valid donation amount.');
      setStatus('failure');
      return;
    }

    if (!paymentService.validatePAN(formData.pan.toUpperCase())) {
      setErrorMessage('Please enter a valid PAN number.');
      setStatus('failure');
      return;
    }

    setErrorMessage(null);

    await paymentService.initiateDonation(
      {
        amount,
        type: selectedTab,
        donor: {
          fullName: formData.fullName,
          email: formData.email,
          mobileNumber: formData.mobile,
          address: formData.address,
          nationality,
          panNumber: formData.pan.toUpperCase(),
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

          <form onSubmit={handleSubmit} className="donate-modal-form">
            {/* Amount Selection */}
            <div className="donate-form-section">
              <label className="donate-form-label">Choose an Amount</label>
              <div className="donate-amount-options">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`donate-amount-btn ${selectedAmount === amount ? 'donate-amount-btn--selected' : ''}`}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
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
                  placeholder="Enter custom amount"
                  className="donate-custom-amount-input"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  disabled={isBusy}
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="donate-form-section">
              <label className="donate-form-label">Enter Full Name *</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="donate-form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={isBusy}
              />
            </div>

            {/* Email */}
            <div className="donate-form-section">
              <label className="donate-form-label">Enter Email Address *</label>
              <input
                type="email"
                placeholder="Enter Email ID"
                className="donate-form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isBusy}
              />
            </div>

            {/* Mobile */}
            <div className="donate-form-section">
              <label className="donate-form-label">Mobile Number *</label>
              <div className="donate-mobile-input-wrapper">
                <div className="donate-country-code">+91</div>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  className="donate-form-input donate-form-input--mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  required
                  disabled={isBusy}
                />
              </div>
              <p className="donate-form-note">All Donation updates will be sent through this number*</p>
            </div>

            {/* Address */}
            <div className="donate-form-section">
              <label className="donate-form-label">Address *</label>
              <input
                type="text"
                className="donate-form-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                disabled={isBusy}
              />
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
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                required
                disabled={isBusy}
              />
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
