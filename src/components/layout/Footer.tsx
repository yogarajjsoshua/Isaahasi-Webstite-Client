import React from 'react';

const isahasiLogoFooter = "https://www.figma.com/api/mcp/asset/722e1877-da44-4916-830f-96e892fe8598.png";
const instagramIcon = "https://www.figma.com/api/mcp/asset/e71cfb92-f985-4be8-ab61-50de038530f1.svg";
const linkedinIcon = "https://www.figma.com/api/mcp/asset/ff8dc3c7-3071-4d2e-b2cb-b3774475334f.svg";
const dividerLine = "https://www.figma.com/api/mcp/asset/5428f81a-2097-4b3b-9093-eee8a829d116.svg";

function MdiInstagram({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[28px]"}>
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={instagramIcon} />
    </div>
  );
}

function RiLinkedinFill({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[32px]"}>
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={linkedinIcon} />
    </div>
  );
}

export const Footer: React.FC = () => {
  return (
    <div className="bg-[#5a8b86] h-[395px] overflow-clip relative w-full">
      <div className="absolute h-[122px] left-[calc(75%-6px)] top-[79px] w-[303px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[321.43%] left-[-0.03%] max-w-none top-[-71.43%] w-[100.06%]" src={isahasiLogoFooter} />
        </div>
      </div>
      <RiLinkedinFill className="absolute left-[calc(91.67%+3px)] size-[32px] top-[215px]" />
      <ul className="[word-break:break-word] absolute block font-['Outfit:Light'] font-light h-[57px] leading-[0] left-[63px] text-[14px] text-white top-[57px] w-[535px]">
        <li className="leading-[normal] list-disc ms-[21px] whitespace-pre-wrap">
          <span className="[word-break:break-word] font-['Outfit:Medium'] font-medium">{`iSaahasi Academy India Foundation is registered as a non-profit organization  `}</span>
          {`under Section 8(1) of the Companies Act 2013 - Registration Number CIN: U93090MH2016NPL284468 and under Section 80G of India's Income Tax Act 1961.`}
        </li>
      </ul>
      <ul className="[word-break:break-word] absolute block font-['Outfit:Light'] font-light h-[53px] leading-[0] left-[63px] text-[14px] text-white top-[126px] w-[393px]">
        <li className="leading-[normal] list-disc ms-[21px]">
          <span className="[word-break:break-word] font-['Outfit:Medium'] font-medium">iSaahasi Academy India Foundation</span>
          {` is a part of International Sanctuary globally which has been serving survivors of trafficking since 2007.`}
        </li>
      </ul>
      <div className="absolute h-0 left-[63px] top-[317px] w-[1314px]">
        <div className="absolute inset-[-2px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={dividerLine} />
        </div>
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Poppins:Regular'] h-[84px] justify-center leading-[0] left-[86px] not-italic text-[0px] text-white top-[233px] w-[245px] whitespace-pre-wrap">
        <p className="leading-[22px] mb-0 text-[14px]">​</p>
        <p className="leading-[22px] mb-0 text-[14px]">​</p>
        <p className="text-[14px]">
          <span className="leading-[22px]">
            {`Contact `}
            <br aria-hidden />
          </span>
          <span className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic">
            Email : isaahasiindia@gmail.com
            <br aria-hidden />
            Phone : +91 9920852249
          </span>
          <span className="leading-[22px]">
            <br aria-hidden />
            <br aria-hidden />
          </span>
        </p>
      </div>
      <div className="[word-break:break-word] absolute content-stretch flex font-['Poppins:Regular'] gap-[421px] items-center left-[86px] not-italic text-[#f0f0f0] top-[334px] w-[1200px] whitespace-nowrap">
        <div className="content-stretch flex gap-[126px] items-center relative shrink-0 text-[14px]">
          <a className="block cursor-pointer leading-[0] relative shrink-0">
            <p className="leading-[22px]">Privacy policy</p>
          </a>
          <p className="leading-[22px] relative shrink-0">
            Terms of Use
          </p>
        </div>
        <p className="leading-[22px] relative shrink-0 text-[15px] text-right">
          © 2026, All Rights Reserved
        </p>
      </div>
      <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[22px] items-start left-[calc(58.33%-19px)] not-italic text-[14px] top-[61px] w-[190px]">
        <p className="font-['Poppins:SemiBold'] leading-[18px] relative shrink-0 text-white tracking-[1px] uppercase w-full">
          get involved
        </p>
        <a className="block cursor-pointer font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#f0f0f0] w-full">
          <p className="leading-[22px]">Reports and Compliance</p>
        </a>
        <a className="block cursor-pointer font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#f0f0f0] w-full">
          <p className="leading-[22px]">Fundraise, Sponsor, Partner</p>
        </a>
        <a className="block cursor-pointer font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#f0f0f0] w-full">
          <p className="leading-[22px]">Careers</p>
        </a>
        <button className="block cursor-pointer font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#f0f0f0] text-left w-full">
          <p className="leading-[22px]">Donate</p>
        </button>
      </div>
      <MdiInstagram className="absolute left-[calc(91.67%-42px)] size-[28px] top-[219px]" />
    </div>
  );
};
