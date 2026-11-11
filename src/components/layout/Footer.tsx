import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import isahasiLogoFooter from '../../assets/images/footer/logo.webp';
import instagramIcon from '../../assets/icons/footer/instagram.svg';
import linkedinIcon from '../../assets/icons/footer/linkedin.svg';
import { DonateModal } from '../DonateModal';

export const Footer: React.FC = () => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <>
    <footer className="footer-wrapper">
      <div className="footer-top">
        {/* Left Section - About */}
        <div className="footer-about">
          <ul className="footer-info-list">
            <li>
              <strong>iSaahasi Academy India Foundation is registered as a non-profit organization</strong> under Section 8(1) of the Companies Act 2013 - Registration Number CIN: U93090MH2016NPL284468 and under Section 80G of India's Income Tax Act 1961.
            </li>
            <li>
              <strong>iSaahasi Academy India Foundation</strong> is a part of International Sanctuary globally which has been serving survivors of trafficking since 2007.
            </li>
          </ul>

          {/* Contact Info */}
          <div className="footer-contact">
            <p className="footer-contact-title">Contact</p>
            <p>Email : isaahasiindia@gmail.com</p>
            <p>Phone : +91 9920852249</p>
          </div>
        </div>

        {/* Center Section - Get Involved */}
        <div className="footer-get-involved">
          <h3 className="footer-section-title">Get involved</h3>
          <ul className="footer-links">
            <li><Link to="/compliance">Reports and Compliance</Link></li>
            <li><Link to="/partner">Fundraise, Sponsor, Partner</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><button type="button" onClick={() => setIsDonateModalOpen(true)}>Donate</button></li>
          </ul>
        </div>

        {/* Right Section - Logo & Social */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img alt="iSAAHASi Academy India Foundation" src={isahasiLogoFooter} />
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <img alt="Instagram" src={instagramIcon} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img alt="LinkedIn" src={linkedinIcon} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-legal">
          <Link to="/privacy-policy">Privacy policy</Link>
          <span>Terms of Use</span>
        </div>
        <p className="footer-copyright">© 2026, All Rights Reserved</p>
      </div>
    </footer>
    {isDonateModalOpen && (
      <DonateModal onClose={() => setIsDonateModalOpen(false)} />
    )}
    </>
  );
};
