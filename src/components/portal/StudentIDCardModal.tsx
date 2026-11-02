import React, { useState, useRef } from 'react';
import { Student } from '../../types';
import { StudentIDCard } from './StudentIDCard';
import { Printer, X, CreditCard, ChevronDown, Download, Loader2, Share2, Cloud } from 'lucide-react';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudent: Student | null;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudent
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || initialStudent || students[0];
  const filename = `Markazul_Furqan_ID_Pass_${currentStudent?.code || 'ST'}_${currentStudent?.name?.replace(/\s+/g, '_') || 'Student'}.pdf`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(cardRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 10
      });
    } catch (err) {
      console.error('ID Card PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!cardRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(cardRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 10
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('ID Card PDF blob generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
          
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 no-print">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-[#D4AF37] flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Official Student Gate Pass
                </h3>
                <p className="text-xs text-gray-500">
                  Printable Halaqah ID credential for Chiro campus
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

          {/* Student Selector */}
          <div className="my-4 no-print">
            <label className="text-xs font-bold text-gray-600 block mb-1.5">
              Select Enrolled Candidate:
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#0F5132] cursor-pointer"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - Juz {s.juzLevel}/30
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* The Printable ID Card Container */}
          <div ref={cardRef} className="my-6 p-2 bg-transparent printable-id-pass">
            {currentStudent ? (
              <StudentIDCard student={currentStudent} />
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">No student selected.</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-gray-100 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download high-resolution ID Gate Pass PDF file"
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
              className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Share Gate Pass or save to Google Drive"
            >
              <Share2 className="w-4 h-4 text-indigo-200" />
              <span>Share & Drive</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print ID Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`Student ID Gate Pass: ${currentStudent?.name || 'Student'}`}
        filename={filename}
        blob={pdfBlob || undefined}
        recipientPhone={currentStudent?.guardianPhone}
        summaryText={`Official Markazul Furqan Student Gate Pass ID for ${currentStudent?.name} (${currentStudent?.code}). Track: ${currentStudent?.track}.`}
      />
    </>
  );
};
