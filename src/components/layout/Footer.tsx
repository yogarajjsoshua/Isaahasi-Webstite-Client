import React from 'react';
import './Footer.css';

const isahasiLogoFooter = "https://www.figma.com/api/mcp/asset/722e1877-da44-4916-830f-96e892fe8598.png";
const instagramIcon = "https://www.figma.com/api/mcp/asset/e71cfb92-f985-4be8-ab61-50de038530f1.svg";
const linkedinIcon = "https://www.figma.com/api/mcp/asset/ff8dc3c7-3071-4d2e-b2cb-b3774475334f.svg";

export const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
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
          <h3 className="footer-section-title">GET INVOLVED</h3>
          <ul className="footer-links">
            <li><a href="#">Reports and Compliance</a></li>
            <li><a href="#">Fundraise, Sponsor, Partner</a></li>
            <li><a href="#">Careers</a></li>
            <li><button>Donate</button></li>
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
      <div className="footer-divider"></div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-legal">
          <a href="#">Privacy policy</a>
          <span>Terms of Use</span>
        </div>
        <p className="footer-copyright">© 2026, All Rights Reserved</p>
      </div>
    </footer>
  );
};
