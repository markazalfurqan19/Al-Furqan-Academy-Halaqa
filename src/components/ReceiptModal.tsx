import React, { useRef, useState } from 'react';
import { DonationPledge } from '../types';
import { OFFICIAL_LOGO_URL } from '../data/initialData';
import { Printer, X, ShieldCheck, Heart, Download, Loader2, Share2 } from 'lucide-react';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../utils/pdfGenerator';
import { ShareDocumentModal } from './ShareDocumentModal';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  pledge: DonationPledge | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  pledge
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !pledge) return null;

  const receiptFilename = `Markazul_Furqan_DonationReceipt_${pledge.id}_${pledge.donorName.replace(/\s+/g, '_')}.pdf`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(receiptRef.current, {
        filename: receiptFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
    } catch (err) {
      console.error('Receipt PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!receiptRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(receiptRef.current, {
        filename: receiptFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('Receipt PDF blob generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-gray-900">
              Vision 2030 Donation Receipt
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download high-resolution Receipt PDF file"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-200" />
                  <span>PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handleOpenShare}
              disabled={isGeneratingPdf}
              className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Share donation receipt or save directly to Google Drive"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-200" />
              <span>Share & Drive</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Container */}
        <div 
          ref={receiptRef}
          className="printable-receipt relative bg-white p-6 border-2 border-[#D4AF37] rounded-3xl text-gray-800 space-y-4 my-4 shadow-sm"
        >
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Al-Furqan Watermark" 
              className="w-72 h-72 object-contain"
            />
          </div>

          <div className="flex items-center justify-between border-b border-[#D4AF37]/50 pb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white p-0.5 shadow-sm shrink-0">
                <img 
                  src={OFFICIAL_LOGO_URL} 
                  alt="Al-Furqan Quran Center Emblem" 
                  className="w-full h-full object-cover rounded-full" 
                />
              </div>
              <div>
                <div className="text-xs font-arabic font-bold text-[#0F5132]">
                  مركز الفرقان لتحفيظ القرآن الكريم
                </div>
                <h4 className="text-sm font-black text-gray-900 uppercase">
                  Markazul Furqan Capital Fund
                </h4>
                <p className="text-[10px] text-gray-500 font-semibold">
                  Vision 2030 Building & Endowment • Chiro, Ethiopia
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 px-2 py-1 rounded border border-[#D4AF37]/40 block">
                REC-{pledge.id.slice(-6)}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">{pledge.date}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs relative z-10">
            <div>
              <span className="text-gray-500 block text-[10px]">Received from Benefactor:</span>
              <strong className="text-gray-900 text-sm">{pledge.donorName}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Contact Details:</span>
              <strong className="text-gray-800">{pledge.phoneOrEmail}</strong>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Sponsorship Tier:</span>
              <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] inline-block mt-0.5">
                {pledge.tier}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">Channel / Ref:</span>
              <strong className="font-mono text-gray-800">{pledge.channel} ({pledge.referenceNumber || 'Verified'})</strong>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block">Amount Contributed</span>
              <span className="text-xs text-[#0F5132] font-semibold">{pledge.purpose}</span>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black text-[#0F5132]">
                ETB {pledge.amountETB.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block">
                Official Sadaqah Jariyah Voucher
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[11px] relative z-10">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Registered Religious Trust & Academy</span>
            </div>
            <div className="text-right">
              <span className="font-arabic text-[#0F5132] font-bold block text-xs">جزاكم الله خيراً</span>
              <span className="text-[9px] text-gray-400">May Allah accept your benevolence</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 no-print">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Share & Google Drive Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`Vision 2030 Donation Receipt - ${pledge.donorName}`}
        filename={receiptFilename}
        blob={pdfBlob || undefined}
        recipientPhone={pledge.phoneOrEmail}
        summaryText={`Official Markazul Furqan Vision 2030 Donation Receipt for ${pledge.donorName} - Amount: ETB ${pledge.amountETB.toLocaleString()} (${pledge.tier} - ${pledge.purpose}). Thank you for supporting the Academy building & Quran preservation fund.`}
      />
    </div>
  );
};
