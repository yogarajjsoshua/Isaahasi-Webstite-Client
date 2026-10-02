import React, { useState } from 'react';
import { Input } from '../components/ui';
import { formService } from '../services/formService';
import type { VolunteerFormData } from '../types';
import heroHands from '../assets/images/volunteer/hero-hands.png';
import './VolunteerPage.css';
import './PartnerPage.css';

export const VolunteerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [formData, setFormData] = useState<VolunteerFormData>({
    fullName: '',
    email: '',
    mobileNumber: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof VolunteerFormData, string>>>({});

  const handleChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof VolunteerFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
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
      await formService.submit({ type: 'volunteer', data: formData });
      setMessage({ type: 'success', text: 'Thank you for your interest! We will contact you soon.' });
      setFormData({ fullName: '', email: '', mobileNumber: '', message: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="volunteer-page">
      <section className="volunteer-hero">
        <img src={heroHands} alt="" className="volunteer-hero-image" />
        <h1 className="volunteer-hero-title">Ready to Volunteer?</h1>
      </section>

      <section className="volunteer-info">
        <ul className="volunteer-info-list">
          <li>Help us run workshops and skill-building sessions for women survivors of trafficking</li>
          <li>Share your time, talent and resources to support rehabilitation programs</li>
          <li>Be a mentor and help survivors rebuild confidence and independence</li>
        </ul>
      </section>

      <section className="partner-form-section">
        <form onSubmit={handleSubmit} className="partner-form volunteer-form">
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
            label="How would you like to Volunteer"
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
