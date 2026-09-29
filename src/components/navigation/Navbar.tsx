import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { Dropdown } from './Dropdown';
import { MobileMenu } from './MobileMenu';
import './Navbar.css';

interface NavbarProps {
  onDonateClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onDonateClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const aboutUsItems = [
    { label: 'Our Story', path: '/our-story' },
    { label: 'Our Mission', path: '/our-mission' },
    { label: 'Our Team', path: '/our-team' },
  ];

  const ourWorkItems = [
    { label: 'Why iSaahasi?', path: '/why-isaahasi' },
    { label: 'What we do?', path: '/what-we-do' },
  ];

  const storiesItems = [
    { label: 'Her Story', path: '/her-story' },
    { label: 'Updates', path: '/updates' },
  ];

  const getInvolvedItems = [
    { label: 'Volunteer', path: '/volunteer' },
    { label: 'Partner with Us', path: '/partner' },
    { label: 'Donate', action: onDonateClick },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="iSaahasi Academy India Foundation Home">
          <img
            src="/logo.svg"
            alt="iSaahasi Academy India Foundation"
            className="navbar-logo-img"
            width="180"
            height="60"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.textContent = 'iSaahasi';
            }}
          />
        </Link>

        <div className="navbar-desktop">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="navbar-link">Home</Link>
            </li>
            <li className="navbar-item">
              <Dropdown label="About us" items={aboutUsItems} />
            </li>
            <li className="navbar-item">
              <Dropdown label="Our Work" items={ourWorkItems} />
            </li>
            <li className="navbar-item">
              <Dropdown label="Stories" items={storiesItems} />
            </li>
            <li className="navbar-item">
              <Dropdown label="Get Involved" items={getInvolvedItems} />
            </li>
          </ul>

          <div className="navbar-actions">
            <Button onClick={onDonateClick} variant="primary" size="medium">
              Donate Now
            </Button>
          </div>
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar-hamburger"></span>
        </button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onDonateClick={onDonateClick}
      />
    </nav>
  );
};
