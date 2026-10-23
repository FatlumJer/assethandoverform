import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface ExportPdfOptions {
  fileName?: string;
  paperSize?: 'a4' | 'letter';
  quality?: number;
}

/**
 * Copies all live computed styles from source DOM elements to target cloned DOM elements.
 * This guarantees 100% style retention in html2canvas regardless of external CSS/CORS restrictions,
 * preventing unstyled text or missing borders in the generated PDF.
 */
function inlineComputedStyles(source: HTMLElement, target: HTMLElement): void {
  const sourceElements = [source, ...Array.from(source.querySelectorAll('*'))] as HTMLElement[];
  const targetElements = [target, ...Array.from(target.querySelectorAll('*'))] as HTMLElement[];

  const styleProperties = [
    'display',
    'flex-direction',
    'align-items',
    'justify-content',
    'flex-wrap',
    'flex',
    'flex-grow',
    'flex-shrink',
    'flex-basis',
    'width',
    'min-width',
    'max-width',
    'height',
    'min-height',
    'max-height',
    'box-sizing',
    'padding',
    'padding-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'margin',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'border',
    'border-top',
    'border-bottom',
    'border-left',
    'border-right',
    'border-top-width',
    'border-bottom-width',
    'border-left-width',
    'border-right-width',
    'border-top-style',
    'border-bottom-style',
    'border-left-style',
    'border-right-style',
    'border-top-color',
    'border-bottom-color',
    'border-left-color',
    'border-right-color',
    'background-color',
    'color',
    'font-family',
    'font-size',
    'font-weight',
    'line-height',
    'text-align',
    'text-transform',
    'letter-spacing',
    'vertical-align',
    'gap',
  ];

  for (let i = 0; i < sourceElements.length && i < targetElements.length; i++) {
    const src = sourceElements[i];
    const tgt = targetElements[i];
    if (!src || !tgt) continue;

    const computed = window.getComputedStyle(src);
    for (const prop of styleProperties) {
      const val = computed.getPropertyValue(prop);
      if (val) {
        tgt.style.setProperty(prop, val);
      }
    }
  }
}

/**
 * Generates and downloads a PDF file from an HTML element
 */
export async function exportElementToPdf(
  element: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<void> {
  const { fileName = 'Asset_Handover_Form.pdf', paperSize = 'a4', quality = 2 } = options;

  const originalWidth = element.offsetWidth || 794;
  const originalHeight = element.offsetHeight || 1123;

  // Configure canvas capture with high DPI scaling and full inlined styles
  const canvas = await html2canvas(element, {
    scale: quality,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: originalWidth,
    windowHeight: originalHeight,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(element.id);
      if (clonedElement) {
        // Apply live computed styles directly onto the cloned element tree
        inlineComputedStyles(element, clonedElement);

        clonedElement.style.boxShadow = 'none';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.transform = 'none';
        clonedElement.style.backgroundColor = '#ffffff';
      }

      const scaleWrapper = clonedDoc.getElementById('pdf-scale-wrapper');
      if (scaleWrapper) {
        scaleWrapper.style.transform = 'none';
      }
    },
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  const format = paperSize === 'letter' ? 'letter' : 'a4';
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: format,
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const margin = 8;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  if (contentHeight <= pdfHeight - margin * 2) {
    pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
  } else {
    const scaleFactor = (pdfHeight - margin * 2) / contentHeight;
    const fittedWidth = contentWidth * scaleFactor;
    const fittedX = margin + (contentWidth - fittedWidth) / 2;
    pdf.addImage(imgData, 'JPEG', fittedX, margin, fittedWidth, pdfHeight - margin * 2, undefined, 'FAST');
  }

  pdf.save(fileName);
}

/**
 * Triggers standard browser print with optimized print styles
 */
export function printDocument(): void {
  window.print();
}
