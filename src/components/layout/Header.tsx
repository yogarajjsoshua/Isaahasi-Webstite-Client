import React from 'react';
import './Header.css';

const imgMenuItemArrow = "https://www.figma.com/api/mcp/asset/dd428b18-b365-4982-bbd2-00e48037aa98.svg";
const imgIndiaLogoIsaahasiAcademyIndiaFoundation4 = "https://www.figma.com/api/mcp/asset/1a27d586-e469-4304-9803-7e437f539d91.png";

type DonateProps = {
  className?: string;
};

function Donate({ className }: DonateProps) {
  return (
    <button className={`${className} bg-[#5a8b86] flex items-center justify-center`}>
      <span className="font-['Inter',sans-serif] font-medium text-[22px] text-white">
        Donate
      </span>
    </button>
  );
}

type MenuItemProps = {
  className?: string;
  text?: string;
  type?: "regular" | "dropdown_parent";
};

function MenuItem({ className, text = "Menu Item", type = "regular" }: MenuItemProps) {
  const isDropdownParent = type === "dropdown_parent";
  return (
    <div className={className}>
      <span className="font-['Outfit',sans-serif] font-normal text-[22px] text-[rgba(0,0,0,0.5)] whitespace-nowrap">
        {text}
      </span>
      {isDropdownParent && (
        <div className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[8px] flex items-center justify-center">
          <div className="rotate-90 w-[8px] h-[15px]">
            <img alt="" className="w-full h-full" src={imgMenuItemArrow} />
          </div>
        </div>
      )}
    </div>
  );
}

export const Header: React.FC = () => {
  return (
    <header className="w-full h-[174px] bg-white" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: '0px 3px 8px rgba(31, 85, 80, 0.24)' }}>
      {/* Logo Section - White Background */}
      <div className="w-full h-[112px] bg-white relative flex items-center justify-center">
        <div className="w-[246px] h-[94px] relative overflow-hidden">
          <img
            alt="iSAAHASi Academy India Foundation"
            className="absolute left-0 w-full"
            style={{
              top: '-78.19%',
              height: '339.89%',
              maxWidth: 'none'
            }}
            src={imgIndiaLogoIsaahasiAcademyIndiaFoundation4}
          />
        </div>
      </div>

      {/* Navigation Bar - Light Green Background */}
      <div className="w-full h-[62px] bg-[#d9ebe6] relative flex items-center justify-center">
        <div className="flex items-center gap-[50px]">
          <a className="flex items-center justify-center px-[20px] py-[16px]">
            <span className="font-['Outfit',sans-serif] font-normal text-[22px] text-[rgba(0,0,0,0.5)] whitespace-nowrap">
              Home
            </span>
          </a>
          <MenuItem className="flex gap-[10px] items-start px-[20px] py-[16px] relative rounded-[8px] w-[153px]" text="About Us" type="dropdown_parent" />
          <button className="flex gap-[10px] items-start px-[20px] py-[16px] relative rounded-[8px] w-[153px]">
            <span className="font-['Outfit',sans-serif] font-normal text-[22px] text-[rgba(0,0,0,0.5)] whitespace-nowrap">
              Our Work
            </span>
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 w-[15px] h-[8px] flex items-center justify-center">
              <div className="rotate-90 w-[8px] h-[15px]">
                <img alt="" className="w-full h-full" src={imgMenuItemArrow} />
              </div>
            </div>
          </button>
          <MenuItem className="flex gap-[10px] items-start px-[20px] py-[16px] relative rounded-[8px] w-[153px]" text="Stories" type="dropdown_parent" />
          <MenuItem className="flex gap-[10px] items-start px-[20px] py-[16px] relative rounded-[8px] w-[185px]" text="Get Involved " type="dropdown_parent" />
        </div>

        {/* Donate Button - Right Side */}
        <div className="absolute right-0 top-0 h-full">
          <Donate className="h-[62px] w-[197px]" />
        </div>
      </div>
    </header>
  );
};
