import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Cloud, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Loader2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { saveDocumentToGoogleDrive, downloadBlob } from '../utils/shareUtils';
import { generateWhatsAppUrl, generateSmsUrl } from '../utils/messaging';

export interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filename: string;
  blob?: Blob;
  csvContent?: string;
  recipientPhone?: string;
  summaryText?: string;
  onShowToast?: (msg: string) => void;
}

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  filename,
  blob,
  csvContent,
  recipientPhone = '',
  summaryText = '',
  onShowToast
}) => {
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isCsv = filename.toLowerCase().endsWith('.csv');

  // 1. Native Web Share
  const handleNativeShare = async () => {
    let fileBlob = blob;
    if (!fileBlob && csvContent) {
      fileBlob = new Blob([csvContent], { type: 'text/csv' });
    }

    if (!fileBlob) return;
    const file = new File([fileBlob], filename, { type: fileBlob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title,
          text: summaryText || `${title} from Markazul Furqan Academy`
        });
        if (onShowToast) onShowToast('Shared successfully!');
        onClose();
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.warn('Native share aborted or unsupported:', err);
        }
      }
    } else {
      if (onShowToast) onShowToast('Native sharing not supported on this browser. Use WhatsApp or Google Drive below.');
    }
  };

  // 2. Direct Download
  const handleDownload = () => {
    let fileBlob = blob;
    if (!fileBlob && csvContent) {
      fileBlob = new Blob([csvContent], { type: 'text/csv' });
    }
    if (fileBlob) {
      downloadBlob(fileBlob, filename);
      if (onShowToast) onShowToast(`Downloaded ${filename}!`);
    }
  };

  // 3. Save to Google Drive
  const handleSaveToDrive = async () => {
    try {
      setIsSavingToDrive(true);
      const link = await saveDocumentToGoogleDrive({
        filename,
        blob,
        csvContent,
        onShowToast
      });
      setDriveLink(link);
    } catch (err: any) {
      console.error('Save to Drive error:', err);
      if (onShowToast) onShowToast(err.message || 'Failed to save to Google Drive');
    } finally {
      setIsSavingToDrive(false);
    }
  };

  // 4. Copy summary text
  const handleCopySummary = () => {
    const textToCopy = `${title}\n${summaryText}\nMarkazul Furqan Academy • Chiro, Ethiopia`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onShowToast) onShowToast('Summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `*${title}*\n${summaryText || 'Official Academic Document'}\n\nMarkazul Furqan Quranic Academy (Chiro, Ethiopia)`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center border border-emerald-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Share & Download
              </h3>
              <p className="text-[11px] text-gray-500 font-mono truncate max-w-[220px]">
                {filename}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="py-4 space-y-2.5">
          
          {/* Native Share (If supported) */}
          <button
            onClick={handleNativeShare}
            className="w-full bg-[#0F5132] hover:bg-[#0A3622] text-white p-3 rounded-2xl transition flex items-center justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <Share2 className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <div className="text-xs font-bold">Share to Apps / Nearby</div>
                <div className="text-[10px] text-emerald-200">AirDrop, WhatsApp, Mail, Telegram</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-300" />
          </button>

          {/* Download to Device */}
          <button
            onClick={handleDownload}
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 p-3 rounded-2xl transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <Download className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="text-xs font-bold">Download File Locally</div>
                <div className="text-[10px] text-gray-500">Save directly to your computer or phone</div>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-gray-400 font-mono">
              {isCsv ? 'CSV' : 'PDF'}
            </span>
          </button>

          {/* Google Drive Upload */}
          <div className="border border-emerald-100 bg-emerald-50/50 p-3 rounded-2xl space-y-2">
            <button
              onClick={handleSaveToDrive}
              disabled={isSavingToDrive}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-xl transition flex items-center justify-between text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-200" />
                <span>{isSavingToDrive ? 'Uploading to Drive...' : 'Save to Google Drive'}</span>
              </div>
              {isSavingToDrive ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-normal">
                  Drive v3
                </span>
              )}
            </button>

            {driveLink && (
              <div className="bg-white p-2 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Saved in Academy Drive</span>
                </span>
                <a
                  href={driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0F5132] font-black hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Share */}
          <a
            href={recipientPhone 
              ? generateWhatsAppUrl(recipientPhone, `*${title}*\n${summaryText}\nMarkazul Furqan Academy (Chiro, Ethiopia)`)
              : `https://api.whatsapp.com/send?text=${whatsappMessage}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#0F5132] p-3 rounded-2xl transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <div>
                <div className="text-xs font-bold">Share via WhatsApp</div>
                <div className="text-[10px] text-gray-500">
                  {recipientPhone ? `Send directly to ${recipientPhone}` : 'Send to parent or halaqah group'}
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-600" />
          </a>

          {/* Copy Summary Text */}
          <button
            onClick={handleCopySummary}
            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 p-2.5 rounded-2xl transition flex items-center justify-center gap-2 text-xs font-bold cursor-pointer"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
          </button>

        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-gray-400">
          Markazul Furqan Academic Ledger • Multi-Channel Export
        </div>

      </div>
    </div>
  );
};
