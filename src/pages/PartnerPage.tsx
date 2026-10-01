import React, { useState } from 'react';
import { Input } from '../components/ui';
import { formService } from '../services/formService';
import type { PartnerFormData } from '../types';
import heroCollage from '../assets/images/partner/hero-collage.jpg';
import infoImage1 from '../assets/images/partner/info-1.jpg';
import infoImage2 from '../assets/images/partner/info-2.jpg';
import infoImage3 from '../assets/images/partner/info-3.jpg';
import './PartnerPage.css';

export const PartnerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>({
    fullName: '',
    organisationName: '',
    email: '',
    mobileNumber: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PartnerFormData, string>>>({});

  const handleChange = (field: keyof PartnerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PartnerFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.organisationName.trim()) newErrors.organisationName = 'Organisation name is required';
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
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await formService.submit({ type: 'partner', data: formData });
      setMessage({ type: 'success', text: 'Thank you for your interest! We will contact you soon.' });
      setFormData({ fullName: '', organisationName: '', email: '', mobileNumber: '', message: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-page">
      <section className="partner-hero">
        <div className="partner-hero-inner">
          <h1 className="partner-hero-title">Ready to make a change?</h1>
          <img src={heroCollage} alt="Hands joined in partnership" className="partner-hero-image" />
        </div>
      </section>

      <section className="partner-info">
        <ul className="partner-info-list">
          <li>If you are a Non Government Organization that works with women survivors of trafficking, we can partner to strengthen the rehabilitation of the women</li>
          <li>If you are a corporate looking to volunteer your time, resources and opportunities</li>
        </ul>
        <div className="partner-info-images">
          <img src={infoImage1} alt="" />
          <img src={infoImage2} alt="" />
          <img src={infoImage3} alt="" />
        </div>
      </section>

      <section className="partner-form-section">
        <form onSubmit={handleSubmit} className="partner-form">
          <Input
            id="fullName"
            name="fullName"
            label="Enter Full Name"
            placeholder="Enter Name"
            required
            value={formData.fullName}
            onChange={(value) => handleChange('fullName', value)}
            error={errors.fullName}
          />

          <Input
            id="organisationName"
            name="organisationName"
            label="Name of Organisation (Corporate / NGO)"
            placeholder="Enter Organisation"
            required
            value={formData.organisationName}
            onChange={(value) => handleChange('organisationName', value)}
            error={errors.organisationName}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Enter Email Address"
            placeholder="Enter Email ID"
            required
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
          />

          <div className="input-wrapper">
            <label htmlFor="mobileNumber" className="input-label">
              Mobile Number<span className="input-required">*</span>
            </label>
            <div className="mobile-input-row">
              <span className="mobile-prefix">+91</span>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Enter Mobile Number"
                required
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                className={`input-field mobile-input-field ${errors.mobileNumber ? 'input-error' : ''}`}
              />
            </div>
            {errors.mobileNumber && <span className="input-error-message">{errors.mobileNumber}</span>}
          </div>

          <Input
            id="message"
            name="message"
            type="textarea"
            label="How would you like to Partner with Us"
            placeholder="Describe in 80-100 words"
            required
            value={formData.message}
            onChange={(value) => handleChange('message', value)}
            error={errors.message}
            rows={6}
          />

          {message && (
            <div className={`form-message form-message--${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="form-submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'SUBMIT'}
          </button>
        </form>
      </section>
    </div>
  );
};
