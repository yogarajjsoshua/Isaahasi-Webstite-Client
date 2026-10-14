import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DonateModal } from '../DonateModal';
import './Header.css';
import imgMenuItemArrow from '../../assets/icons/header/menu-arrow.svg';
import imgIndiaLogoIsaahasiAcademyIndiaFoundation4 from '../../assets/images/header/logo.png';

type DropdownItem = {
  label: string;
  path?: string;
  onClick?: () => void;
};

type MenuItemProps = {
  text: string;
  isActive?: boolean;
  dropdownItems?: DropdownItem[];
};

function MenuItem({ text, isActive = false, dropdownItems }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="menu-item-wrapper"
      onMouseEnter={() => dropdownItems && setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className={`menu-item-text ${isActive ? 'menu-item-text--active' : ''}`}>
        {text}
      </span>
      {dropdownItems && (
        <>
          <div className="menu-item-arrow">
            <img alt="" src={imgMenuItemArrow} />
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              {dropdownItems.map((item, index) => (
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    className="dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

type MobileAccordionItemProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: DropdownItem[];
  onNavigate: () => void;
};

function MobileAccordionItem({ label, isOpen, onToggle, items, onNavigate }: MobileAccordionItemProps) {
  return (
    <div className="mobile-nav-section">
      <button
        className="mobile-nav-section-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {label}
        <img
          alt=""
          src={imgMenuItemArrow}
          className={`mobile-nav-section-arrow ${isOpen ? 'mobile-nav-section-arrow--open' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mobile-nav-subitems">
          {items.map((item, index) => (
            item.path ? (
              <Link
                key={index}
                to={item.path}
                className="mobile-nav-sublink"
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={index}
                className="mobile-nav-sublink"
                onClick={() => {
                  item.onClick?.();
                  onNavigate();
                }}
              >
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export const Header: React.FC = () => {
  const location = useLocation();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  const aboutUsItems: DropdownItem[] = [
    { label: 'Our Story', path: '/our-story' },
    { label: 'Our Team', path: '/our-team' },
    { label: 'Vision', path: '/vision' }
  ];

  const ourWorkItems: DropdownItem[] = [
    { label: 'Why Isaahasi', path: '/our-work#our-work-why' },
    { label: 'What we Do', path: '/our-work#our-work-what' }
  ];

  const storiesItems: DropdownItem[] = [
    { label: 'Her Story', path: '/her-story' },
    { label: 'Updates', path: '/updates' }
  ];

  const getInvolvedItems: DropdownItem[] = [
    { label: 'Volunteer', path: '/volunteer' },
    { label: 'Partner with Us', path: '/partner' },
    { label: 'Donate', onClick: () => setIsDonateModalOpen(true) }
  ];

  const mobileSections = [
    { key: 'about', label: 'About Us', items: aboutUsItems },
    { key: 'work', label: 'Our Work', items: ourWorkItems },
    { key: 'stories', label: 'Stories', items: storiesItems },
    { key: 'involved', label: 'Get Involved', items: getInvolvedItems },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSection(null);
  };

  return (
    <>
      <header className="header-wrapper">
        {/* Logo Section */}
        <div className="header-logo-section">
          <Link to="/" className="header-logo">
            <img
              alt="iSAAHASi Academy India Foundation"
              src={imgIndiaLogoIsaahasiAcademyIndiaFoundation4}
            />
          </Link>
        </div>

        {/* Navigation Bar */}
        <nav className="header-nav">
          <div className="header-menu-items">
            <Link to="/" className="menu-item-wrapper">
              <span className={`menu-item-text ${location.pathname === '/' ? 'menu-item-text--active' : ''}`}>
                Home
              </span>
            </Link>
            <MenuItem text="About Us" dropdownItems={aboutUsItems} />
            <MenuItem text="Our Work" dropdownItems={ourWorkItems} />
            <MenuItem text="Stories" dropdownItems={storiesItems} />
            <MenuItem text="Get Involved" dropdownItems={getInvolvedItems} />
          </div>

          {/* Donate Button */}
          <button
            className="header-donate-button"
            onClick={() => setIsDonateModalOpen(true)}
          >
            Donate
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="header-hamburger-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="header-hamburger" />
          </button>
        </nav>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-panel">
            <Link
              to="/"
              className={`mobile-nav-link ${location.pathname === '/' ? 'mobile-nav-link--active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            {mobileSections.map((section) => (
              <MobileAccordionItem
                key={section.key}
                label={section.label}
                isOpen={openMobileSection === section.key}
                onToggle={() =>
                  setOpenMobileSection((prev) => (prev === section.key ? null : section.key))
                }
                items={section.items}
                onNavigate={closeMobileMenu}
              />
            ))}
            <button
              className="mobile-nav-donate-button"
              onClick={() => {
                setIsDonateModalOpen(true);
                closeMobileMenu();
              }}
            >
              Donate
            </button>
          </div>
        )}
      </header>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <DonateModal onClose={() => setIsDonateModalOpen(false)} />
      )}
    </>
  );
};
