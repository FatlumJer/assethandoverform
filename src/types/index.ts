export interface AssetItem {
  id: string;
  nr: number | string;
  description: string;
  assetTag: string;
  qty: number | string;
  price: string;
  remarks: string;
}

export type PaperSize = 'a4' | 'letter';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type ThemeColor = 'black' | 'navy' | 'slate' | 'emerald' | 'blue';
export type HeaderBg = 'none' | 'subtle' | 'tinted';

export interface FormattingOptions {
  paperSize: PaperSize;
  fontFamily: FontFamily;
  themeColor: ThemeColor;
  headerBg: HeaderBg;
  borderWidth: '1px' | '1.5px' | '2px';
  showPrice: boolean;
  showTotals: boolean;
  currency: string;
  minimumRows: number;
  compactSpacing: boolean;
}

export interface HandoverFormData {
  // Document Header
  documentTitle: string;
  companyName: string;
  contactHeaderTitle: string;
  location: string;
  contactEmail: string;
  mobileContact: string;
  officePhone: string;
  showLogo: boolean;
  logoStyle: 'blue-on-white' | 'badge-card';

  // Personnel Info
  employeeName: string;
  employeeId: string;
  projectDepartment: string;
  assetsHfTag: string;
  handoverDate: string;
  handoverBy: string;

  // Introduction
  introText: string;

  // Items
  items: AssetItem[];

  // Signatures
  plTlTitle: string;
  plTlName: string;
  plTlSignature: string; // Data URL or empty

  itDeptTitle: string;
  itDeptName: string;
  itDeptSignature: string; // Data URL or empty

  // Declaration
  declarationTitle: string;
  employeeSalutation: string;
  declarationText: string;

  // Remarks & Employee Signature
  otherRemarks: string;
  employeeSignatureTitle: string;
  employeeSignature: string; // Data URL or empty
  employeeSignedDate: string;

  // Footer
  footerLeft: string;
  footerRight: string;
  documentRef: string;

  // Formatting
  formatting: FormattingOptions;
}
