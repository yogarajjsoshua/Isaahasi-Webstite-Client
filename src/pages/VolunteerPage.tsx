import React, { useState } from 'react';
import { Input } from '../components/ui';
import { formService } from '../services/formService';
import type { VolunteerFormData } from '../types';
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

  const heroImage = "https://www.figma.com/api/mcp/asset/f9g8h7i6-j5k4-l3m2-n1o0-p9q8r7s6t5u4.png";

  return (
    <div className="volunteer-page">
      {/* Hero Section */}
      <section className="volunteer-hero">
        <img src={heroImage} alt="Volunteer with Us" className="volunteer-hero-image" />
        <div className="volunteer-hero-content">
          <h1 className="volunteer-hero-title">Volunteer</h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="volunteer-form-section">
        <div className="volunteer-form-container">
          <div className="volunteer-form-intro">
            <h2 className="volunteer-form-title">Make a Difference</h2>
            <p className="volunteer-form-description">
              Join our mission to empower survivors of trafficking. Your time and skills
              can help create lasting change in the lives of women rebuilding their futures.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="volunteer-form">
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
              label="How would you like to Volunteer"
              placeholder="Tell us about your skills and interests..."
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
