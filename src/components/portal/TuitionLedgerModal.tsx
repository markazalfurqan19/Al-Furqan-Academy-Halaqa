import React, { useState, useRef } from 'react';
import { Student, TuitionRecord } from '../../types';
import { DollarSign, X, CheckCircle2, Printer, Plus, ChevronDown, CreditCard, Download, Loader2, Share2 } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface TuitionLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  tuitionRecords: TuitionRecord[];
  onSaveTuition: (record: TuitionRecord) => Promise<void> | void;
}

export const TuitionLedgerModal: React.FC<TuitionLedgerModalProps> = ({
  isOpen,
  onClose,
  students,
  tuitionRecords,
  onSaveTuition
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [month, setMonth] = useState('Hidar / November 2026');
  const [amountETB, setAmountETB] = useState<number>(800);
  const [status, setStatus] = useState<'PAID' | 'PENDING' | 'OVERDUE' | 'SPONSORED'>('PAID');
  const [paymentMethod, setPaymentMethod] = useState<'Telebirr' | 'CBE Birr' | 'Awash Bank' | 'Cash' | 'Endowment'>('Telebirr');
  const [sponsorName, setSponsorName] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<TuitionRecord | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const receiptNumber = status === 'SPONSORED'
      ? `KAF-${Date.now().toString().slice(-6)}`
      : `RCP-${Date.now().toString().slice(-6)}`;

    const newRecord: TuitionRecord = {
      id: `tuition-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentCode: currentStudent.code,
      guardianName: currentStudent.guardianName,
      guardianPhone: currentStudent.guardianPhone,
      month,
      amountETB,
      status,
      paymentMethod,
      sponsorName: status === 'SPONSORED' ? sponsorName : undefined,
      receiptNumber,
      paidDate: new Date().toISOString().split('T')[0]
    };

    await onSaveTuition(newRecord);
    setActiveReceipt(newRecord);
  };

  const tuitionFilename = activeReceipt
    ? `Markazul_Furqan_TuitionReceipt_${activeReceipt.receiptNumber}_${activeReceipt.studentCode}.pdf`
    : 'Markazul_Furqan_TuitionReceipt.pdf';

  const handleDownloadPdf = async () => {
    if (!receiptRef.current || !activeReceipt) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(receiptRef.current, {
        filename: tuitionFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
    } catch (err) {
      console.error('Tuition PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!receiptRef.current || !activeReceipt) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(receiptRef.current, {
        filename: tuitionFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('Tuition PDF blob generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shadow-xs">
              <DollarSign className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Tuition Ledger & Kafalat al-Yateem Sponsorships
              </h3>
              <p className="text-xs text-gray-500">
                Markazul Furqan Treasury • Chiro, Ethiopia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeReceipt ? (
          /* Printable Tuition Receipt */
          <div className="space-y-4 my-4">
            <div 
              ref={receiptRef}
              className="printable-receipt p-6 bg-white border-2 border-purple-300 rounded-3xl text-gray-800 space-y-4 print:border-black print:p-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-purple-200 pb-3">
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
                      Markazul Furqan Treasury
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">
                      Official Fee & Kafalat Receipt • Chiro
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-950 px-2 py-1 rounded border border-purple-200">
                    {activeReceipt.receiptNumber}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">{activeReceipt.paidDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Student Name:</span>
                  <strong className="text-gray-900">{activeReceipt.studentName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Student Code:</span>
                  <strong className="font-mono text-[#0F5132]">{activeReceipt.studentCode}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Guardian:</span>
                  <strong className="text-gray-800">{activeReceipt.guardianName} ({activeReceipt.guardianPhone})</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Billing Cycle:</span>
                  <strong className="text-gray-800">{activeReceipt.month}</strong>
                </div>
              </div>

              <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">
                    {activeReceipt.status === 'SPONSORED' ? 'Orphan Endowment (Kafalat)' : 'Tuition Received'}
                  </span>
                  <span className="text-xs text-gray-700">
                    {activeReceipt.sponsorName ? `Endowed by: ${activeReceipt.sponsorName}` : `Channel: ${activeReceipt.paymentMethod}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#0F5132]">
                    ETB {activeReceipt.amountETB.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold block">✓ Verified & Cleared</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-purple-200 text-xs">
                <span className="text-[10px] text-gray-400">Markazul Furqan Finance Office</span>
                <div className="text-right">
                  <div className="h-6 border-b border-dashed border-gray-400 w-32 mb-1" />
                  <span className="text-[9px] text-gray-400">Accountant Signature & Stamp</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Record Another Fee
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download high-resolution Tuition Voucher PDF"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>Building PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={handleOpenShare}
                disabled={isGeneratingPdf}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Share tuition receipt or save directly to Google Drive"
              >
                <Share2 className="w-4 h-4 text-indigo-200" />
                <span>Share & Drive</span>
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          /* Fee Record Form */
          <form onSubmit={handleRecordPayment} className="space-y-4 my-4 no-print">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Select Student:
              </label>
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#0F5132]"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code}) - {s.guardianName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Billing Month:
                </label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Tuition Fee Amount (ETB):
                </label>
                <input
                  type="number"
                  value={amountETB}
                  onChange={(e) => setAmountETB(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Payment Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="PAID">Paid / Cleared</option>
                  <option value="SPONSORED">Sponsored (Kafalat al-Yateem)</option>
                  <option value="PENDING">Pending Payment</option>
                  <option value="OVERDUE">Overdue Notice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Payment Method / Channel:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Telebirr">Telebirr (Ethio Telecom)</option>
                  <option value="CBE Birr">CBE Birr / Bank Transfer</option>
                  <option value="Awash Bank">Awash Bank Transfer</option>
                  <option value="Cash">Cash at Treasury Office</option>
                  <option value="Endowment">Waqf & Endowment Fund</option>
                </select>
              </div>
            </div>

            {status === 'SPONSORED' && (
              <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200">
                <label className="text-xs font-bold text-purple-900 block mb-1">
                  Orphan Sponsor / Foundation Name:
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Hajji Ahmed Foundation or Diaspora Donor #42"
                  className="w-full text-xs font-bold bg-white border border-purple-300 rounded-xl px-3.5 py-2 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-800 hover:bg-purple-900 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-200" />
                <span>Save Record & Issue Receipt</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Share & Google Drive Modal */}
      {activeReceipt && (
        <ShareDocumentModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Official Tuition Receipt - ${activeReceipt.studentName}`}
          filename={tuitionFilename}
          blob={pdfBlob || undefined}
          recipientPhone={activeReceipt.guardianPhone}
          summaryText={`Markazul Furqan Official Tuition Receipt (${activeReceipt.receiptNumber}) for ${activeReceipt.studentName} (${activeReceipt.studentCode}) - Month: ${activeReceipt.month}. Amount: ETB ${activeReceipt.amountETB.toLocaleString()} (${activeReceipt.status}).`}
        />
      )}
    </div>
  );
};
