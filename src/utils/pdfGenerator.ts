import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfOptions {
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | [number, number];
  filename?: string;
  marginMm?: number;
  quality?: number;
}

/**
 * Builds a jsPDF document from an HTML container element and returns both jsPDF and binary Blob.
 */
export async function generatePdfBlobFromElement(
  element: HTMLElement,
  options: PdfOptions = {}
): Promise<{ blob: Blob; filename: string; pdf: jsPDF }> {
  const {
    orientation = 'portrait',
    format = 'a4',
    filename = 'Markazul_Furqan_Document.pdf',
    marginMm = 8,
    quality = 0.98
  } = options;

  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  const imgData = canvas.toDataURL('image/jpeg', quality);

  const isLandscape = orientation === 'landscape';
  const pdf = new jsPDF({
    orientation: isLandscape ? 'l' : 'p',
    unit: 'mm',
    format: format as any
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const usableWidth = pdfWidth - marginMm * 2;
  const usableHeight = pdfHeight - marginMm * 2;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = imgWidth / imgHeight;

  let finalWidth = usableWidth;
  let finalHeight = usableWidth / ratio;

  if (finalHeight > usableHeight && (options.format !== 'a4' || isLandscape)) {
    finalHeight = usableHeight;
    finalWidth = usableHeight * ratio;
  }

  const xOffset = marginMm + (usableWidth - finalWidth) / 2;
  const yOffset = marginMm;

  if (finalHeight > usableHeight && !isLandscape) {
    let position = yOffset;
    let heightLeft = finalHeight;

    pdf.addImage(imgData, 'JPEG', xOffset, position, finalWidth, finalHeight);
    heightLeft -= usableHeight;

    while (heightLeft > 0) {
      position = -(finalHeight - heightLeft) + marginMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', xOffset, position, finalWidth, finalHeight);
      heightLeft -= usableHeight;
    }
  } else {
    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
  }

  const finalName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
  const blob = pdf.output('blob');

  return { blob, filename: finalName, pdf };
}

/**
 * Generates and immediately downloads a high-fidelity PDF from an HTML element.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  options: PdfOptions = {}
): Promise<Blob> {
  const { blob, filename, pdf } = await generatePdfBlobFromElement(element, options);
  pdf.save(filename);
  return blob;
}

/**
 * Direct print helper triggering system print dialog with clean document formatting
 */
export function triggerPrint() {
  window.print();
}
