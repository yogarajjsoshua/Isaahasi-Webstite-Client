/**
 * Compliance documents shown on the /compliance page.
 *
 * HOW TO EDIT
 * - Add a document: drop the PDF into `public/compliance/`, then add
 *   `{ name: 'Display name', file: '/compliance/your-file.pdf' }` to the
 *   `documents` array of the right section.
 * - Add a section (e.g. a new financial year): add a new
 *   `{ title, documents: [...] }` object at the TOP of `complianceSections`
 *   (the list is ordered newest first).
 * - Rename: change the `name` (display text) or `title` (section heading).
 *   If you rename the PDF itself, update `file` to match.
 * - Remove: delete the entry (and optionally the PDF from `public/compliance/`).
 */

export interface ComplianceDocument {
  name: string;
  /** Public URL of the PDF, e.g. '/compliance/mgt-7-2024-25.pdf' */
  file: string;
}

export interface ComplianceSection {
  title: string;
  documents: ComplianceDocument[];
}

export const complianceSections: ComplianceSection[] = [
  {
    title: 'MGT 7 Return (2024-2025)',
    documents: [
      { name: 'AB9793072 MGT-7-ISAIF Signed', file: '/compliance/mgt-7-2024-25.pdf' },
    ],
  },
  {
    title: 'MGT 7 Return (2023-2024)',
    documents: [
      { name: 'MGT7 Scanned', file: '/compliance/mgt-7-2023-24-scanned.pdf' },
      { name: 'Form MGT 7 ISAAHASI Signed Filed', file: '/compliance/mgt-7-2023-24-signed-filed.pdf' },
    ],
  },
  {
    title: 'MGT 7 Return (2022-2023)',
    documents: [
      { name: 'MGT 7 Scanned 2022-23', file: '/compliance/mgt-7-2022-23.pdf' },
    ],
  },
  {
    title: 'MGT 7 Return (2021-2022)',
    documents: [
      { name: 'Form MGT 7 21-22', file: '/compliance/mgt-7-2021-22.pdf' },
    ],
  },
  {
    title: 'MGT 7 Return (2020-2021)',
    documents: [
      { name: 'Form MGT 7 20-21', file: '/compliance/mgt-7-2020-21.pdf' },
    ],
  },
];
