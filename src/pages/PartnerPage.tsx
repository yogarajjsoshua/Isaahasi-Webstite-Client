import React, { useState } from 'react';
import { Input } from '../components/ui';
import { formService } from '../services/formService';
import type { PartnerFormData } from '../types';
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

  const heroImage = "https://www.figma.com/api/mcp/asset/e8b7c6d5-a4f3-2g1h-0i9j-8k7l6m5n4o3p.png";

  return (
    <div className="partner-page">
      {/* Hero Section */}
      <section className="partner-hero">
        <img src={heroImage} alt="Partner with Us" className="partner-hero-image" />
        <div className="partner-hero-content">
          <h1 className="partner-hero-title">Partner with Us</h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="partner-form-section">
        <div className="partner-form-container">
          <div className="partner-form-intro">
            <h2 className="partner-form-title">Join Our Mission</h2>
            <p className="partner-form-description">
              Together, we can create lasting change. Partner with us to empower survivors
              of trafficking and help them build lives of dignity and hope.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="partner-form">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              required
              value={formData.fullName}
              onChange={(value) => handleChange('fullName', value)}
              error={errors.fullName}
            />

            <Input
              id="organisationName"
              name="organisationName"
              label="Organisation Name"
              required
              value={formData.organisationName}
              onChange={(value) => handleChange('organisationName', value)}
              error={errors.organisationName}
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              required
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
            />

            <Input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              label="Mobile Number"
              placeholder="+91 XXXXXXXXXX"
              required
              value={formData.mobileNumber}
              onChange={(value) => handleChange('mobileNumber', value)}
              error={errors.mobileNumber}
            />

            <Input
              id="message"
              name="message"
              type="textarea"
              label="How would you like to Partner"
              placeholder="Tell us about your partnership ideas..."
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
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
