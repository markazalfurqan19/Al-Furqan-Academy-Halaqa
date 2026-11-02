import React, { useState, useRef } from 'react';
import { Student } from '../../types';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { Printer, X, Award, ChevronDown, Download, Loader2, Share2, Cloud } from 'lucide-react';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface CertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  isOpen,
  onClose,
  student,
  students,
  onSelectStudent
}) => {
  const [certType, setCertType] = useState<'KHATM' | 'MILESTONE' | 'TAJWEED'>('MILESTONE');
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentStudent = student || students[0];
  const filename = `Markazul_Furqan_Certificate_${certType}_${currentStudent?.code || 'ST'}_${currentStudent?.name?.replace(/\s+/g, '_') || 'Student'}.pdf`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(certRef.current, {
        filename,
        orientation: orientation,
        format: 'a4',
        marginMm: 6,
        quality: 0.98
      });
    } catch (err) {
      console.error('Certificate PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!certRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(certRef.current, {
        filename,
        orientation: orientation,
        format: 'a4',
        marginMm: 6,
        quality: 0.98
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('Certificate PDF blob error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-3xl ${orientation === 'landscape' ? 'max-w-4xl' : 'max-w-2xl'} w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6 transition-all duration-300`}>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 no-print">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span>Official Hifz Certificate & Award Generator</span>
            </h3>
            <p className="text-xs text-gray-500">
              Markazul Furqan Quranic & Academic Institution • Chiro, Ethiopia
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download high-resolution Certificate PDF file"
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
              title="Share certificate or save directly to Google Drive"
            >
              <Share2 className="w-4 h-4 text-indigo-200" />
              <span>Share & Drive</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
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

        {/* Candidate, Category, and Format Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 no-print">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Select Recipient Candidate:
            </label>
            <div className="relative">
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => {
                  const found = students.find(s => s.id === e.target.value);
                  if (found) onSelectStudent(found);
                }}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#0F5132]"
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

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Certificate Category:
            </label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value as any)}
              className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
            >
              <option value="MILESTONE">Hifz Milestone Achievement (Juz Level)</option>
              <option value="KHATM">Khatm al-Quran al-Kareem (30 Juz Complete)</option>
              <option value="TAJWEED">Ahkam at-Tajweed & Makharij Excellence</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              PDF Orientation:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  orientation === 'landscape'
                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                A4 Landscape
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                  orientation === 'portrait'
                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                A4 Portrait
              </button>
            </div>
          </div>
        </div>

        {/* The Ornate Printable Certificate Container */}
        <div 
          ref={certRef}
          className={`printable-certificate relative bg-[#FFFDF7] p-8 sm:p-10 border-8 border-double border-[#D4AF37] rounded-3xl text-center space-y-4 my-4 shadow-md ${
            orientation === 'landscape' ? 'landscape-page' : ''
          }`}
        >
          {/* Subtle Institutional Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Al-Furqan Watermark" 
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Ornate corner ornaments */}
          <div className="absolute top-2 left-2 text-[#D4AF37] text-lg select-none">✦</div>
          <div className="absolute top-2 right-2 text-[#D4AF37] text-lg select-none">✦</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37] text-lg select-none">✦</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37] text-lg select-none">✦</div>

          {/* Bismillah */}
          <div className="font-serif text-lg sm:text-xl font-bold text-[#0F5132] tracking-wider relative z-10">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Emblem & Institution Header */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-white p-1 mb-2.5">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Al-Furqan Quran Memorization Center Emblem" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="text-sm font-arabic font-bold text-[#0F5132]">
              مركز الفرقان لتحفيظ القرآن الكريم - جرو - إثيوبيا
            </div>
            <h2 className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-widest mt-0.5">
              Markazul Furqan Quranic & Academic Institution
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Chiro • West Hararghe • Ethiopia
            </p>
          </div>

          {/* Certificate Title */}
          <div className="pt-2 relative z-10">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest block">
              Certificate of Commendation & Ijaza Track
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-serif mt-1">
              {certType === 'KHATM'
                ? 'Khatm al-Quran al-Kareem Completion Award'
                : certType === 'TAJWEED'
                ? 'Excellence in Ahkam at-Tajweed & Recitation'
                : `Hifz Achievement: Completion of Juz ${currentStudent?.juzLevel} of 30`}
            </h1>
          </div>

          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed relative z-10">
            This is to certify that the dedicated candidate student
          </p>

          {/* Student Name */}
          <div className="py-1 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black text-[#0F5132] font-serif tracking-wide border-b-2 border-dashed border-[#D4AF37] inline-block px-8 pb-1">
              {currentStudent?.name}
            </h3>
            <span className="block font-mono text-xs text-gray-500 mt-1">
              Student ID: {currentStudent?.code} • {currentStudent?.track}
            </span>
          </div>

          <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed relative z-10">
            has successfully memorized, revised, and recited with precision and Tajweed under the direct supervision of the Mu'allim faculty in the Halaqat of Markazul Furqan. May Allah SWT grant them lifelong steadfastness and make them among the Ahl al-Quran.
          </p>

          {/* Signatures & Seal */}
          <div className="pt-6 grid grid-cols-3 gap-4 items-end text-xs relative z-10">
            <div className="text-center">
              <div className="h-8 border-b border-gray-400 w-32 mx-auto mb-1" />
              <span className="font-bold text-gray-800 block text-[11px]">Ustadh Ziyad Abdullahi</span>
              <span className="text-[9px] text-gray-400">Head of Halaqat</span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D4AF37] mx-auto flex items-center justify-center text-[8px] font-black text-amber-800 uppercase tracking-tighter bg-amber-50/60 shadow-xs">
                Official Seal
              </div>
              <span className="text-[9px] font-mono text-gray-500 mt-1 block">
                {new Date().toISOString().split('T')[0]} • Chiro
              </span>
            </div>

            <div className="text-center">
              <div className="h-8 border-b border-gray-400 w-32 mx-auto mb-1" />
              <span className="font-bold text-gray-800 block text-[11px]">Sheikh Nuruddin Ahmed</span>
              <span className="text-[9px] text-gray-400">Chief Executive Director</span>
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

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`Hifz Certificate: ${currentStudent?.name || 'Student'} (${certType})`}
        filename={filename}
        blob={pdfBlob || undefined}
        recipientPhone={currentStudent?.guardianPhone}
        summaryText={`Official Markazul Furqan Hifz Certificate for ${currentStudent?.name} (${currentStudent?.code}). Type: ${certType}. Level: Juz ${currentStudent?.juzLevel}/30.`}
      />
    </div>
  );
};
