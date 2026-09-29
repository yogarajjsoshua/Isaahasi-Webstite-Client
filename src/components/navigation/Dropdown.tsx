import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';

interface DropdownItem {
  label: string;
  path?: string;
  action?: () => void;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
}

export const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <button
        className="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <svg
          className={`dropdown-arrow ${isOpen ? 'dropdown-arrow--open' : ''}`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          {items.map((item, index) => (
            <div key={index} className="dropdown-item" role="menuitem">
              {item.path ? (
                <Link
                  to={item.path}
                  className="dropdown-link"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : item.action ? (
                <button
                  className="dropdown-button"
                  onClick={() => {
                    item.action!();
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
