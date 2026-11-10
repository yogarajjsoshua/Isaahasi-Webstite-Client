import React from 'react';
import './CompliancePage.css';
import { complianceSections } from '../data/complianceDocuments';

const PdfIcon: React.FC = () => (
  <svg
    className="compliance-doc-icon"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fontSize="6"
      fontWeight="700"
      fontFamily="Outfit, sans-serif"
      fill="currentColor"
      stroke="none"
    >
      PDF
    </text>
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

export const CompliancePage: React.FC = () => {
  return (
    <div className="compliance-page">
      <header className="compliance-header">
        <h1 className="compliance-title">Compliance</h1>
        <div className="compliance-divider" />
        <p className="compliance-intro">
          iSaahasi Academy India Foundation is registered under section 8(1) of
          the Companies Act, 2013, and holds 12A and 80G income-tax
          registrations. Our statutory filings and compliance documents are
          available below.
        </p>
      </header>

      <div className="compliance-sections">
        {complianceSections.map((section) => (
          <section
            key={section.title}
            className="compliance-section"
            aria-labelledby={`compliance-${section.title.replace(/\W+/g, '-').toLowerCase()}`}
          >
            <h2
              className="compliance-section-title"
              id={`compliance-${section.title.replace(/\W+/g, '-').toLowerCase()}`}
            >
              {section.title}
            </h2>
            <ul className="compliance-doc-list">
              {section.documents.map((doc) => (
                <li key={doc.file} className="compliance-doc">
                  <PdfIcon />
                  <span className="compliance-doc-name">{doc.name}</span>
                  <div className="compliance-doc-actions">
                    <a
                      className="compliance-action compliance-action--view"
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${doc.name} (PDF, opens in a new tab)`}
                    >
                      View
                    </a>
                    <a
                      className="compliance-action compliance-action--download"
                      href={doc.file}
                      download
                      aria-label={`Download ${doc.name} (PDF)`}
                    >
                      <DownloadIcon />
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
