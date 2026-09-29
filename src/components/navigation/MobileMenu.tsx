import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDonateClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onDonateClick }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleDonateClick = () => {
    onDonateClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-menu" role="navigation" aria-label="Mobile navigation">
      <div className="mobile-menu-content">
        <div className="mobile-menu-section">
          <button
            className="mobile-menu-section-title"
            onClick={() => toggleSection('about')}
            aria-expanded={expandedSection === 'about'}
          >
            About us
            <span className="mobile-menu-arrow">{expandedSection === 'about' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'about' && (
            <div className="mobile-menu-items">
              <Link to="/our-story" className="mobile-menu-link" onClick={handleLinkClick}>
                Our Story
              </Link>
              <Link to="/our-team" className="mobile-menu-link" onClick={handleLinkClick}>
                Our Team
              </Link>
              <Link to="/vision" className="mobile-menu-link" onClick={handleLinkClick}>
                Vision
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-section">
          <button
            className="mobile-menu-section-title"
            onClick={() => toggleSection('work')}
            aria-expanded={expandedSection === 'work'}
          >
            Our Work
            <span className="mobile-menu-arrow">{expandedSection === 'work' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'work' && (
            <div className="mobile-menu-items">
              <Link to="/our-work" className="mobile-menu-link" onClick={handleLinkClick}>
                Our Work
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-section">
          <button
            className="mobile-menu-section-title"
            onClick={() => toggleSection('stories')}
            aria-expanded={expandedSection === 'stories'}
          >
            Stories
            <span className="mobile-menu-arrow">{expandedSection === 'stories' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'stories' && (
            <div className="mobile-menu-items">
              <Link to="/her-story" className="mobile-menu-link" onClick={handleLinkClick}>
                Her Story
              </Link>
              <Link to="/updates" className="mobile-menu-link" onClick={handleLinkClick}>
                Updates
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-section">
          <button
            className="mobile-menu-section-title"
            onClick={() => toggleSection('involved')}
            aria-expanded={expandedSection === 'involved'}
          >
            Get Involved
            <span className="mobile-menu-arrow">{expandedSection === 'involved' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'involved' && (
            <div className="mobile-menu-items">
              <Link to="/volunteer" className="mobile-menu-link" onClick={handleLinkClick}>
                Volunteer
              </Link>
              <Link to="/partner" className="mobile-menu-link" onClick={handleLinkClick}>
                Partner with Us
              </Link>
              <button className="mobile-menu-link" onClick={handleDonateClick}>
                Donate
              </button>
            </div>
          )}
        </div>

        <div className="mobile-menu-donate">
          <Button onClick={handleDonateClick} variant="primary" size="large">
            Donate Now
          </Button>
        </div>
      </div>
    </div>
  );
};
