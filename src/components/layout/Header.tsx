import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DonateModal } from '../DonateModal';
import './Header.css';

const imgMenuItemArrow = "https://www.figma.com/api/mcp/asset/0b3a0107-57ae-4c75-bff4-a4c104608159.svg";
const imgIndiaLogoIsaahasiAcademyIndiaFoundation4 = "https://www.figma.com/api/mcp/asset/8c0af3fd-7f4c-46cc-a65b-27a1d16e371c.png";

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

export const Header: React.FC = () => {
  const location = useLocation();
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const aboutUsItems: DropdownItem[] = [
    { label: 'Our Story', path: '/our-story' },
    { label: 'Our Team', path: '/our-team' },
    { label: 'Vision', path: '/vision' }
  ];

  const ourWorkItems: DropdownItem[] = [
    { label: 'Our Work', path: '/our-work' }
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
        </nav>
      </header>

      {/* Donate Modal */}
      {isDonateModalOpen && (
        <DonateModal onClose={() => setIsDonateModalOpen(false)} />
      )}
    </>
  );
};
