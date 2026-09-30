import React, { useState } from 'react';
import './DonateModal.css';

const imgRectangle20 = "https://www.figma.com/api/mcp/asset/45537811-86b5-4acc-9663-4c4ec6748a2f.png";
const imgMaterialSymbolsClose = "https://www.figma.com/api/mcp/asset/75bf025c-288a-44f2-a7fd-055495830639.svg";

type DonateModalProps = {
  onClose: () => void;
};

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

  const presetAmounts = [500, 1000, 5000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation submitted:', {
      type: selectedTab,
      amount: selectedAmount || customAmount,
      nationality,
      ...formData
    });
  };

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
            >
              DONATE ONCE
            </button>
            <button
              className={`donate-modal-tab ${selectedTab === 'monthly' ? 'donate-modal-tab--active' : ''}`}
              onClick={() => setSelectedTab('monthly')}
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
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="donate-submit-btn">
              DONATE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
