import React from 'react';
import { HandoverFormData, AssetItem } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface PdfDocumentPreviewProps {
  data: HandoverFormData;
  onOpenSignatureModal?: (field: 'plTl' | 'itDept' | 'employee') => void;
  scale?: number;
}

export const PdfDocumentPreview: React.FC<PdfDocumentPreviewProps> = ({
  data,
  onOpenSignatureModal,
  scale = 1,
}) => {
  const { formatting } = data;

  // Font family class
  const fontClass =
    formatting.fontFamily === 'serif'
      ? 'font-serif'
      : formatting.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  // Theme borders
  const borderColor =
    formatting.themeColor === 'navy'
      ? 'border-blue-950'
      : formatting.themeColor === 'slate'
      ? 'border-slate-800'
      : formatting.themeColor === 'emerald'
      ? 'border-emerald-950'
      : formatting.themeColor === 'blue'
      ? 'border-sky-900'
      : 'border-black';

  const borderClass =
    formatting.borderWidth === '2px'
      ? `border-2 ${borderColor}`
      : formatting.borderWidth === '1.5px'
      ? `border-[1.5px] ${borderColor}`
      : `border ${borderColor}`;

  // Thin internal line class
  const tableBorderClass =
    formatting.borderWidth === '2px'
      ? `border-t-2 border-l-2 ${borderColor}`
      : `border-t border-l ${borderColor}`;
  const cellBorderClass =
    formatting.borderWidth === '2px'
      ? `border-r-2 border-b-2 ${borderColor}`
      : `border-r border-b ${borderColor}`;

  // Header background tone
  const headerBgClass =
    formatting.headerBg === 'subtle'
      ? 'bg-neutral-100/70'
      : formatting.headerBg === 'tinted'
      ? formatting.themeColor === 'navy'
        ? 'bg-blue-50/60'
        : formatting.themeColor === 'emerald'
        ? 'bg-emerald-50/60'
        : 'bg-neutral-100'
      : 'bg-white';

  // Calculate items and empty rows to fill page
  const itemsCount = data.items.length;
  const blankRowsNeeded = Math.max(0, formatting.minimumRows - itemsCount);
  const blankRows = Array.from({ length: blankRowsNeeded });

  // Calculate totals
  const totalQty = data.items.reduce((acc, item) => {
    const val = typeof item.qty === 'number' ? item.qty : parseFloat(item.qty) || 0;
    return acc + val;
  }, 0);

  const totalPrice = data.items.reduce((acc, item) => {
    const val = parseFloat(item.price) || 0;
    return acc + val;
  }, 0);

  // Compile formatted declaration text
  const formattedDeclaration = data.declarationText
    .replace('{salutation}', data.employeeSalutation)
    .replace('{employeeName}', data.employeeName ? data.employeeName : '.......................................................')
    .replace('{companyName}', data.companyName ? `${data.companyName.split('-')[0].trim()} LLC` : 'KiKxxl&evroTarget LLC');

  return (
    <div
      id="pdf-scale-wrapper"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
      className="pdf-scale-wrapper transition-transform duration-150 print:transform-none print:w-full print:m-0 print:p-0"
    >
      {/* Outer Paper Canvas Container: A4 210mm x 297mm (standard 794px width) */}
      <div
        id="printable-pdf-document"
        className={`w-[794px] min-h-[1123px] bg-white text-black p-[28px] box-border shadow-2xl relative select-text text-[11px] leading-[1.3] print:shadow-none print:p-0 print:w-full print:min-h-0 print:m-0 print:bg-white ${fontClass}`}
        style={{ color: '#000000', backgroundColor: '#ffffff' }}
      >
        {/* Outer Form Border enclosing all main fields */}
        <div className={`w-full ${borderClass} flex flex-col`}>
          {/* 1. DOCUMENT TITLE */}
          <div className="py-2.5 text-center border-b border-black">
            <h1 className="text-[21px] font-bold tracking-tight uppercase text-black">
              {data.documentTitle || 'ASSET HANDOVER FORM'}
            </h1>
          </div>

          {/* 2. COMPANY HEADER & LOGO GRID */}
          <div className="flex border-b border-black">
            {/* Left 82%: Company & Contact Details */}
            <div className="flex-1 flex flex-col border-r border-black">
              {/* Row 1: Company Name */}
              <div className={`py-1 text-center font-bold text-[13px] border-b border-black ${headerBgClass}`}>
                {data.companyName}
              </div>

              {/* Row 2: Contact Information Subtitle */}
              <div className="py-0.5 text-center font-bold text-[11px] border-b border-black bg-neutral-50/50">
                {data.contactHeaderTitle}
              </div>

              {/* Row 3: Location | Contact Email */}
              <div className="flex border-b border-black divide-x divide-black text-[10.5px]">
                <div className="w-[45%] px-2 py-0.5 flex items-center">
                  <span className="font-semibold mr-1">Location:</span>
                  <span>{data.location}</span>
                </div>
                <div className="w-[55%] px-2 py-0.5 flex items-center">
                  <span className="font-semibold mr-1">Contact:</span>
                  <span className="truncate">{data.contactEmail}</span>
                </div>
              </div>

              {/* Row 4: Mobile Phone | Office Phone */}
              <div className="flex divide-x divide-black text-[10.5px]">
                <div className="w-[55%] px-2 py-0.5 flex items-center">
                  <span className="font-semibold mr-1">Mobile (Viber, WhatsApp):</span>
                  <span>{data.mobileContact}</span>
                </div>
                <div className="w-[45%] px-2 py-0.5 flex items-center">
                  <span className="font-semibold mr-1">Office Phone Nr:</span>
                  <span>{data.officePhone}</span>
                </div>
              </div>
            </div>

            {/* Right 18%: Company Logo Cell */}
            <div className="w-[150px] flex items-center justify-center p-1.5 bg-white">
              {data.showLogo ? (
                <CompanyLogo
                  variant={data.logoStyle || 'blue-on-white'}
                />
              ) : (
                <div className="text-[10px] text-neutral-400 font-mono">NO LOGO</div>
              )}
            </div>
          </div>

          {/* 3. PERSONNEL & ASSIGNMENT DETAILS (2x3 Grid) */}
          <div className="flex flex-col border-b border-black text-[11px]">
            {/* Row 1 */}
            <div className="flex border-b border-black divide-x divide-black">
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[135px] shrink-0">Name of Employee:</span>
                <span className="font-bold">{data.employeeName || '—'}</span>
              </div>
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[125px] shrink-0">Assets HF Tagg:</span>
                <span className="font-mono text-[10.5px]">{data.assetsHfTag || '—'}</span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex border-b border-black divide-x divide-black">
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[135px] shrink-0">Employee ID NR:</span>
                <span className="font-mono">{data.employeeId || '—'}</span>
              </div>
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[125px] shrink-0">Handover Date:</span>
                <span>{data.handoverDate || '—'}</span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex divide-x divide-black">
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[135px] shrink-0">Project / Department:</span>
                <span>{data.projectDepartment || '—'}</span>
              </div>
              <div className="w-1/2 px-2 py-1 flex items-baseline">
                <span className="font-semibold w-[125px] shrink-0">Handover BY:</span>
                <span>{data.handoverBy || '—'}</span>
              </div>
            </div>
          </div>

          {/* 4. INTRODUCTORY BANNER */}
          <div className="px-2 py-1 text-[10.5px] font-normal border-b border-black bg-neutral-50/40">
            {data.introText}
          </div>

          {/* 5. ASSET INVENTORY TABLE */}
          <div className="flex flex-col border-b border-black">
            {/* Table Header Row */}
            <div className={`flex border-b border-black font-bold text-[10.5px] uppercase ${headerBgClass}`}>
              <div className="w-[45px] py-1 text-center border-r border-black">NR:</div>
              <div className="flex-1 px-2 py-1 border-r border-black">DESCRIPTION</div>
              <div className="w-[130px] px-2 py-1 border-r border-black">ASSET TAG</div>
              <div className="w-[50px] py-1 text-center border-r border-black">QTY</div>
              {formatting.showPrice && (
                <div className="w-[75px] py-1 text-right pr-2 border-r border-black">PRICE</div>
              )}
              <div className="w-[125px] px-2 py-1">Remarks</div>
            </div>

            {/* Populated Rows */}
            {data.items.map((item, index) => (
              <div
                key={item.id || index}
                className={`flex border-b border-black text-[10.5px] min-h-[24px] items-stretch ${
                  index % 2 === 1 ? 'bg-neutral-50/30' : 'bg-white'
                }`}
              >
                <div className="w-[45px] py-1 text-center font-mono border-r border-black flex items-center justify-center">
                  {item.nr || index + 1}
                </div>
                <div className="flex-1 px-2 py-1 border-r border-black font-medium flex items-center">
                  {item.description}
                </div>
                <div className="w-[130px] px-2 py-1 border-r border-black font-mono text-[10px] flex items-center">
                  {item.assetTag}
                </div>
                <div className="w-[50px] py-1 text-center font-mono border-r border-black flex items-center justify-center">
                  {item.qty}
                </div>
                {formatting.showPrice && (
                  <div className="w-[75px] py-1 text-right pr-2 font-mono border-r border-black flex items-center justify-end">
                    {item.price ? `${formatting.currency}${item.price}` : '—'}
                  </div>
                )}
                <div className="w-[125px] px-2 py-1 text-[10px] text-neutral-800 flex items-center">
                  {item.remarks}
                </div>
              </div>
            ))}

            {/* Empty Padding Rows to match the paper form layout */}
            {blankRows.map((_, idx) => (
              <div
                key={`blank-${idx}`}
                className="flex border-b border-black text-[10px] h-[24px] items-stretch bg-white"
              >
                <div className="w-[45px] border-r border-black flex items-center justify-center font-mono text-neutral-300">
                  {itemsCount + idx + 1}
                </div>
                <div className="flex-1 border-r border-black" />
                <div className="w-[130px] border-r border-black" />
                <div className="w-[50px] border-r border-black" />
                {formatting.showPrice && <div className="w-[75px] border-r border-black" />}
                <div className="w-[125px]" />
              </div>
            ))}

            {/* Totals Row (if enabled) */}
            {formatting.showTotals && itemsCount > 0 && (
              <div className="flex border-b border-black font-bold text-[10.5px] bg-neutral-100/60">
                <div className="w-[45px] py-1 border-r border-black" />
                <div className="flex-1 px-2 py-1 border-r border-black text-right uppercase tracking-wider text-[10px]">
                  Total Items:
                </div>
                <div className="w-[130px] px-2 py-1 border-r border-black text-neutral-500 font-mono text-[10px]">
                  {itemsCount} Line Items
                </div>
                <div className="w-[50px] py-1 text-center font-mono border-r border-black">
                  {totalQty}
                </div>
                {formatting.showPrice && (
                  <div className="w-[75px] py-1 text-right pr-2 font-mono border-r border-black">
                    {formatting.currency}
                    {totalPrice.toFixed(2)}
                  </div>
                )}
                <div className="w-[125px] px-2 py-1 text-[9px] text-neutral-500">Verified</div>
              </div>
            )}
          </div>

          {/* 6. SIGNATURE ROW (PL/TL Dept Head & IT Dept) */}
          <div className="flex border-b border-black divide-x divide-black min-h-[64px]">
            {/* PL / TL Department Head */}
            <div
              onClick={() => onOpenSignatureModal?.('plTl')}
              className="w-1/2 p-2 flex flex-col justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors group"
            >
              <div className="font-bold text-[10.5px] uppercase tracking-tight flex items-center justify-between">
                <span>{data.plTlTitle}</span>
                {!data.plTlSignature && (
                  <span className="text-[9px] text-neutral-400 font-normal no-print group-hover:text-sky-600">
                    Click to sign
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-300">
                <div className="text-[10px] text-neutral-700">
                  {data.plTlName || 'Department Head'}
                </div>
                {data.plTlSignature ? (
                  <img
                    src={data.plTlSignature}
                    alt="PL/TL Signature"
                    className="max-h-10 max-w-[130px] object-contain"
                  />
                ) : (
                  <div className="w-28 h-6 border-b border-dashed border-neutral-400" />
                )}
              </div>
            </div>

            {/* IT Department Signature */}
            <div
              onClick={() => onOpenSignatureModal?.('itDept')}
              className="w-1/2 p-2 flex flex-col justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors group"
            >
              <div className="font-bold text-[10.5px] uppercase tracking-tight flex items-center justify-between">
                <span>{data.itDeptTitle}</span>
                {!data.itDeptSignature && (
                  <span className="text-[9px] text-neutral-400 font-normal no-print group-hover:text-sky-600">
                    Click to sign
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-300">
                <div className="text-[10px] text-neutral-800 font-medium">
                  {data.handoverBy || data.itDeptName || 'IT Representative'}
                </div>
                {data.itDeptSignature ? (
                  <img
                    src={data.itDeptSignature}
                    alt="IT Signature"
                    className="max-h-10 max-w-[130px] object-contain"
                  />
                ) : (
                  <div className="w-28 h-6 border-b border-dashed border-neutral-400" />
                )}
              </div>
            </div>
          </div>

          {/* 7. ACKNOWLEDGMENT AND DECLARATION BY EMPLOYEE */}
          <div className="border-b border-black">
            <div className={`px-2 py-1 font-bold text-[10.5px] uppercase border-b border-black ${headerBgClass}`}>
              {data.declarationTitle}
            </div>
            <div className="p-2.5 text-[10.5px] text-justify leading-relaxed">
              <p>{formattedDeclaration}</p>
            </div>
          </div>

          {/* 8. OTHER REMARKS & EMPLOYEE SIGNATURE */}
          <div className="flex divide-x divide-black min-h-[72px]">
            {/* Left 60%: Other Remarks */}
            <div className="w-[60%] p-2 flex flex-col justify-start">
              <span className="font-bold text-[10.5px] uppercase mb-1">
                OTHER REMARKS:
              </span>
              <p className="text-[10px] text-neutral-800 leading-normal whitespace-pre-wrap">
                {data.otherRemarks || 'None'}
              </p>
            </div>

            {/* Right 40%: Employee Signature */}
            <div
              onClick={() => onOpenSignatureModal?.('employee')}
              className="w-[40%] p-2 flex flex-col justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors group"
            >
              <div className="flex items-center justify-between font-bold text-[10.5px] uppercase">
                <span>{data.employeeSignatureTitle}</span>
                {!data.employeeSignature && (
                  <span className="text-[9px] text-neutral-400 font-normal no-print group-hover:text-sky-600">
                    Click to sign
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center justify-center my-1 min-h-[36px]">
                {data.employeeSignature ? (
                  <img
                    src={data.employeeSignature}
                    alt="Employee Signature"
                    className="max-h-12 max-w-[170px] object-contain"
                  />
                ) : (
                  <div className="w-full h-8 flex items-end justify-center">
                    <span className="border-b border-dotted border-neutral-400 w-44 inline-block text-center text-[10px] text-neutral-400">
                      Sign here
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[9.5px] text-neutral-600 border-t border-neutral-300 pt-0.5">
                <span>Date: {data.employeeSignedDate || data.handoverDate}</span>
                <span className="truncate max-w-[120px] font-medium text-neutral-800">
                  {data.employeeName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. DOCUMENT FOOTER (Outside main box) */}
        <div className="flex justify-between items-center text-[9.5px] text-neutral-600 mt-2 px-1 tracking-wider uppercase font-semibold">
          <span>{data.footerLeft}</span>
          {data.documentRef && (
            <span className="font-mono text-[9px] text-neutral-400 lowercase">
              {data.documentRef}
            </span>
          )}
          <span>{data.footerRight}</span>
        </div>
      </div>
    </div>
  );
};
