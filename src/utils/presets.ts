import { HandoverFormData } from '../types';

export const LOCATION_OPTIONS = ['Prishtine', 'Gjilan', 'Peja'] as const;

export const HANDOVER_BY_OPTIONS = [
  'Dritero Lulaj',
  'Vion Alshiqi',
  'Deniz Ibar',
  'Vlera Islami',
  'Fatlum Jerliu',
  'Argjend Nimani',
] as const;

export const PROJECT_OPTIONS = [
  'Vodafone',
  'EON',
  'Flixbus',
  'Burnhard',
  'H24',
  'Sixt',
  'HR',
  'IT',
  'Hagebau',
  'WFM',
] as const;

export const INITIAL_KIKXXL_DATA: HandoverFormData = {
  documentTitle: 'ASSET HANDOVER FORM',
  companyName: 'KiKxxl&evroTarget - Prishtine',
  contactHeaderTitle: 'KiKxxl&evroTarget contact information',
  location: 'Prishtine',
  contactEmail: 'it-support@kikxxl-evrotarget.com',
  mobileContact: '+383 49 972 010',
  officePhone: '88888',
  showLogo: true,
  logoStyle: 'blue-on-white',

  employeeName: 'Arben Krasniqi',
  employeeId: 'EMP-84920',
  projectDepartment: 'Vodafone',
  assetsHfTag: 'HF-PR-2026-08',
  handoverDate: '2026-10-05',
  handoverBy: 'Dritero Lulaj',

  introText:
    'Listed below are assets handed over to you, to support you in carrying out your assignment in a most proficient manner',

  items: [
    {
      id: '1',
      nr: '1',
      description: 'Lenovo ThinkPad L15 Gen 4 Intel Core i7 16GB / 512GB SSD',
      assetTag: 'TAG-LNV-99120',
      qty: 1,
      price: '850.00',
      remarks: 'AC Adapter 65W & Laptop Bag included',
    },
    {
      id: '2',
      nr: '2',
      description: 'Dell 24" UltraSharp FHD IPS Monitor (U2422H)',
      assetTag: 'TAG-MON-44812',
      qty: 1,
      price: '210.00',
      remarks: 'HDMI and DP cables provided',
    },
    {
      id: '3',
      nr: '3',
      description: 'Jabra Evolve 40 Stereo USB-C / 3.5mm Headset with Mic',
      assetTag: 'TAG-AUD-31089',
      qty: 1,
      price: '85.00',
      remarks: 'New foam cushions, carrying pouch',
    },
    {
      id: '4',
      nr: '4',
      description: 'Logitech MK295 Silent Wireless Keyboard & Mouse Combo',
      assetTag: 'TAG-ACC-11044',
      qty: 1,
      price: '45.00',
      remarks: 'USB Unifying Receiver paired',
    },
    {
      id: '5',
      nr: '5',
      description: 'Company RFID Security Access Badge & Keyfob',
      assetTag: 'RFID-PR-0491',
      qty: 1,
      price: '15.00',
      remarks: 'HQ Floor 2 & 3 Authorized Access',
    },
  ],

  plTlTitle: 'PL / TL Department Head SIGNATURE',
  plTlName: 'Drenusha Hoxha (Team Lead)',
  plTlSignature: '',

  itDeptTitle: 'IT DEPARTMENT SIGNATURE',
  itDeptName: 'Dritero Lulaj',
  itDeptSignature: '',

  declarationTitle: 'ACKNOWLEDGMENT AND DECLARATION BY EMPLOYEE',
  employeeSalutation: 'Ms./Mr.',
  declarationText:
    'I, {salutation} {employeeName} hereby acknowledge that I have received the above-mentioned assets. I understand that these assets belong to {companyName} and are given to me temporarily so I could be able to carry out my everyday work. I am aware that for as long as these assets are in my use, they are my responsibility, and I am obliged to return them to the same condition I received. I will take care of these assets to the best possible extend.',

  otherRemarks: 'Assets inspected upon receipt. All equipment in operational status. Serial numbers verified with internal IT inventory.',
  employeeSignatureTitle: 'EMPLOYEE SIGNATURE:',
  employeeSignature: '',
  employeeSignedDate: '2026-10-05',

  footerLeft: 'ASSET HANDOVER FORM',
  footerRight: 'INTERNAL USE',
  documentRef: 'DOC-KIK-HF-2026',

  formatting: {
    paperSize: 'a4',
    fontFamily: 'sans',
    themeColor: 'black',
    headerBg: 'none',
    borderWidth: '1.5px',
    showPrice: true,
    showTotals: true,
    currency: '€',
    minimumRows: 12,
    compactSpacing: false,
  },
};

export const PRESET_TEMPLATES: { id: string; name: string; description: string; data: Partial<HandoverFormData> }[] = [
  {
    id: 'kikxxl-default',
    name: 'Standard Form',
    description: 'Default handover form with standard equipment preset',
    data: INITIAL_KIKXXL_DATA,
  },
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Empty asset rows ready for custom manual or digital entry',
    data: {
      ...INITIAL_KIKXXL_DATA,
      employeeName: '',
      employeeId: '',
      projectDepartment: 'Vodafone',
      assetsHfTag: '',
      handoverDate: new Date().toISOString().split('T')[0],
      items: [
        { id: '1', nr: '1', description: '', assetTag: '', qty: 1, price: '', remarks: '' },
        { id: '2', nr: '2', description: '', assetTag: '', qty: 1, price: '', remarks: '' },
        { id: '3', nr: '3', description: '', assetTag: '', qty: 1, price: '', remarks: '' },
      ],
      otherRemarks: '',
      plTlSignature: '',
      itDeptSignature: '',
      employeeSignature: '',
    },
  },
];
