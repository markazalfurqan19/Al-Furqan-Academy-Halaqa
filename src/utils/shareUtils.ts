import { uploadBlobToDrive, uploadTextFileToDrive } from '../lib/drive';
import { getAccessToken } from '../lib/firebase';

export interface ShareOptions {
  title: string;
  filename: string;
  text?: string;
  blob?: Blob;
  csvContent?: string;
  onShowToast?: (msg: string) => void;
}

/**
 * Triggers a standard browser download for a Blob
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a robust browser download for text/csv content with UTF-8 BOM
 */
export function downloadText(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  // Prepend UTF-8 BOM for CSVs so Excel/Sheets correctly displays special characters
  const formattedContent = mimeType.includes('csv') && !content.startsWith('\uFEFF')
    ? '\uFEFF' + content
    : content;
  const blob = new Blob([formattedContent], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Convenience helper to immediately download a CSV file
 */
export function downloadCsv(csvContent: string, filename: string) {
  const safeName = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
  downloadText(csvContent, safeName, 'text/csv;charset=utf-8;');
}

/**
 * Universally shares or downloads a file (PDF, CSV, or Text)
 * Uses native Web Share API where supported, with Google Drive, WhatsApp, and Download fallbacks
 */
export async function shareOrDownloadFile(options: ShareOptions): Promise<{ shared: boolean; savedToDrive?: boolean }> {
  const { title, filename, text = '', blob, csvContent, onShowToast } = options;

  let fileBlob = blob;
  if (!fileBlob && csvContent) {
    fileBlob = new Blob([csvContent], { type: 'text/csv' });
  }

  if (!fileBlob) {
    throw new Error('No content provided to share or download');
  }

  const file = new File([fileBlob], filename, { type: fileBlob.type });

  // 1. Try Native Web Share API (Mobile phones, tablets, modern desktop browsers)
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
        text: text || `${title} from Markazul Furqan Quranic Academy (Chiro, Ethiopia)`
      });
      if (onShowToast) onShowToast('Document shared successfully!');
      return { shared: true };
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Web Share failed, offering direct download/drive fallback:', err);
      }
    }
  }

  // 2. Default: Download directly to user machine
  downloadBlob(fileBlob, filename);
  if (onShowToast) onShowToast(`Downloaded ${filename}`);

  return { shared: false };
}

/**
 * Directly saves a PDF Blob or CSV to the user's Google Drive inside "Markazul Furqan Academic Archives"
 */
export async function saveDocumentToGoogleDrive(params: {
  filename: string;
  blob?: Blob;
  csvContent?: string;
  onShowToast?: (msg: string) => void;
}): Promise<string> {
  const { filename, blob, csvContent, onShowToast } = params;
  const token = await getAccessToken();

  if (!token) {
    const errorMsg = 'Please sign in with your Google Account in the top bar to enable Google Drive sync.';
    if (onShowToast) onShowToast(errorMsg);
    throw new Error(errorMsg);
  }

  if (onShowToast) onShowToast(`Saving ${filename} to Google Drive...`);

  let res;
  if (blob) {
    res = await uploadBlobToDrive({
      accessToken: token,
      filename,
      blob
    });
  } else if (csvContent) {
    res = await uploadTextFileToDrive({
      accessToken: token,
      filename,
      content: csvContent,
      mimeType: 'text/csv'
    });
  } else {
    throw new Error('No document provided for Google Drive upload');
  }

  if (onShowToast) onShowToast(`Saved to Google Drive: ${res.name}!`);
  return res.webViewLink;
}
