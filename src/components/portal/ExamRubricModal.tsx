import React, { useState, useRef } from 'react';
import { Student, ExamRecord, HifzGrade } from '../../types';
import { Award, X, Printer, CheckCircle2, ChevronDown, Download, Loader2, Share2 } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface ExamRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudent: Student | null;
  exams: ExamRecord[];
  onSaveExam: (exam: ExamRecord) => Promise<void> | void;
}

export const ExamRubricModal: React.FC<ExamRubricModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudent,
  exams,
  onSaveExam
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [juzTested, setJuzTested] = useState('Juz 1 - 5 Comprehensive');
  const [hifzScore, setHifzScore] = useState<number>(38); // max 40
  const [makharijScore, setMakharijScore] = useState<number>(28); // max 30
  const [tajweedScore, setTajweedScore] = useState<number>(29); // max 30
  const [examinerName, setExaminerName] = useState('Sheikh Nuruddin Ahmed');
  const [remarks, setRemarks] = useState('Commendable fluency and precision in recitation.');
  const [viewMode, setViewMode] = useState<'FORM' | 'SLIP'>('FORM');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const slipRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || initialStudent || students[0];
  const totalScore = Math.min(100, Math.max(0, hifzScore + makharijScore + tajweedScore));

  let grade: HifzGrade = 'MUMTAZ';
  if (totalScore >= 90) grade = 'MUMTAZ';
  else if (totalScore >= 80) grade = 'JAYYID_JIDDAN';
  else if (totalScore >= 70) grade = 'JAYYID';
  else if (totalScore >= 60) grade = 'MAQBOOL';
  else grade = 'DAEFE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const newExam: ExamRecord = {
      id: `exam-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentCode: currentStudent.code,
      examDate: new Date().toISOString().split('T')[0],
      juzTested,
      hifzScore,
      makharijScore,
      tajweedScore,
      totalScore,
      grade,
      examinerName,
      remarks
    };

    await onSaveExam(newExam);
    setViewMode('SLIP');
  };

  const examFilename = currentStudent 
    ? `Markazul_Furqan_ExamSlip_${currentStudent.code}_${currentStudent.name.replace(/\s+/g, '_')}.pdf`
    : 'Markazul_Furqan_ExamSlip.pdf';

  const handleDownloadPdf = async () => {
    if (!slipRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(slipRef.current, {
        filename: examFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
    } catch (err) {
      console.error('Exam slip PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!slipRef.current || !currentStudent) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(slipRef.current, {
        filename: examFilename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 8
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('Exam slip share PDF error:', err);
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
        
        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
              <Award className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Oral Hifz & Tajweed Examination Grading Rubric
              </h3>
              <p className="text-xs text-gray-500">
                Institutional standardized evaluation matrix (Chiro, Ethiopia)
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

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 my-4 no-print">
          <button
            onClick={() => setViewMode('FORM')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'FORM' ? 'bg-[#0F5132] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Grading Form
          </button>
          <button
            onClick={() => setViewMode('SLIP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              viewMode === 'SLIP' ? 'bg-[#0F5132] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Printable Exam Slip
          </button>
        </div>

        {viewMode === 'FORM' ? (
          <form onSubmit={handleSubmit} className="space-y-4 no-print">
            {/* Student Picker */}
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Candidate for Examination:
              </label>
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
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
                Juz Scope / Test Portion:
              </label>
              <input
                type="text"
                value={juzTested}
                onChange={(e) => setJuzTested(e.target.value)}
                placeholder="e.g. Juz 1-5 or Surah Al-Kahf to Ta-Ha"
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            {/* Rubric Breakdown Grid */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <span className="text-xs font-black text-[#0F5132] uppercase tracking-wider block">
                Standardized Mark Allocation (100 pts total)
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-gray-700">1. Hifz Solid Memory & Flow (Max 40):</span>
                    <span className="text-[#0F5132] font-black">{hifzScore} / 40</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={hifzScore}
                    onChange={(e) => setHifzScore(Number(e.target.value))}
                    className="w-full accent-[#0F5132]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-gray-700">2. Makharij al-Huruf Precision (Max 30):</span>
                    <span className="text-[#0F5132] font-black">{makharijScore} / 30</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={makharijScore}
                    onChange={(e) => setMakharijScore(Number(e.target.value))}
                    className="w-full accent-[#0F5132]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-gray-700">3. Ahkam at-Tajweed & Sifat (Max 30):</span>
                    <span className="text-[#0F5132] font-black">{tajweedScore} / 30</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={tajweedScore}
                    onChange={(e) => setTajweedScore(Number(e.target.value))}
                    className="w-full accent-[#0F5132]"
                  />
                </div>
              </div>

              {/* Total Calculated Score Badge */}
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-800">Total Score:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-[#0F5132]">{totalScore} / 100</span>
                  <span className="bg-[#0F5132] text-[#D4AF37] px-2.5 py-0.5 rounded-full font-black text-[11px]">
                    {grade}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Examiner Name:
                </label>
                <input
                  type="text"
                  value={examinerName}
                  onChange={(e) => setExaminerName(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Examiner Remarks:
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                />
              </div>
            </div>

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
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Save Assessment & Generate Slip</span>
              </button>
            </div>
          </form>
        ) : (
          /* Printable Slip */
          <div className="space-y-4">
            <div 
              ref={slipRef} 
              className="printable-exam p-6 bg-white border-2 border-[#D4AF37] rounded-3xl text-gray-800 space-y-4 print:border-black print:p-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#D4AF37]/50 pb-3">
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
                      Markazul Furqan Quranic Academy
                    </h4>
                    <p className="text-[10px] text-gray-500 font-semibold">
                      Board of Hifz & Tajweed Examiners • Chiro, Ethiopia
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-1 rounded border border-gray-300">
                    SLIP #{Date.now().toString().slice(-6)}
                  </span>
                  <span className="text-[10px] text-gray-500 block mt-1">{new Date().toISOString().split('T')[0]}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Candidate Name:</span>
                  <strong className="text-gray-900">{currentStudent?.name}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Student ID / Code:</span>
                  <strong className="font-mono text-[#0F5132]">{currentStudent?.code}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Scope Evaluated:</span>
                  <strong className="text-gray-800">{juzTested}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Halaqah Group:</span>
                  <strong className="text-gray-800">{currentStudent?.halaqahGroup}</strong>
                </div>
              </div>

              {/* Rubric Marks Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white text-xs">
                <div className="grid grid-cols-3 bg-gray-100 p-2 font-bold text-gray-700">
                  <span>Category</span>
                  <span className="text-center">Allocation</span>
                  <span className="text-right">Mark Scored</span>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-gray-100">
                  <span>Hifz Memory & Fluency</span>
                  <span className="text-center">40 pts</span>
                  <span className="text-right font-black text-[#0F5132]">{hifzScore}</span>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-gray-100">
                  <span>Makharij al-Huruf</span>
                  <span className="text-center">30 pts</span>
                  <span className="text-right font-black text-[#0F5132]">{makharijScore}</span>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-gray-100">
                  <span>Ahkam at-Tajweed & Sifat</span>
                  <span className="text-center">30 pts</span>
                  <span className="text-right font-black text-[#0F5132]">{tajweedScore}</span>
                </div>
                <div className="grid grid-cols-3 p-2 bg-emerald-50 font-black text-sm">
                  <span>Aggregate Total</span>
                  <span className="text-center">100 pts</span>
                  <span className="text-right text-[#0F5132]">{totalScore} ({grade})</span>
                </div>
              </div>

              <div className="text-xs italic text-gray-600 bg-white p-2.5 rounded-xl border border-gray-100">
                "{remarks}"
              </div>

              <div className="flex justify-between items-end pt-3 border-t border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 block">Lead Examiner:</span>
                  <span className="font-bold text-gray-800">{examinerName}</span>
                </div>
                <div className="text-right">
                  <div className="h-8 border-b border-dashed border-gray-400 w-32 mb-1" />
                  <span className="text-[10px] text-gray-400">Official Examiner Signature</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 no-print">
              <button
                onClick={() => setViewMode('FORM')}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Back to Rubric
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download high-resolution examination slip PDF"
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
                title="Share examination slip or save directly to Google Drive"
              >
                <Share2 className="w-4 h-4 text-indigo-200" />
                <span>Share & Drive</span>
              </button>
              <button
                onClick={handlePrint}
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Share & Google Drive Modal */}
      {currentStudent && (
        <ShareDocumentModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Oral Examination Result - ${currentStudent.name}`}
          filename={examFilename}
          blob={pdfBlob || undefined}
          recipientPhone={currentStudent.guardianPhone}
          summaryText={`Markazul Furqan Oral Examination Result for ${currentStudent.name} (${currentStudent.code}) - Tested on ${juzTested}. Total Score: ${totalScore}/100 (${grade}). Lead Examiner: ${examinerName}.`}
        />
      )}
    </div>
  );
};
