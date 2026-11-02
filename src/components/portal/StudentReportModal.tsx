import React, { useRef, useState } from 'react';
import { Student, HifzLog } from '../../types';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { Printer, X, ShieldCheck, Download, Loader2, CheckCircle2, Share2, Cloud } from 'lucide-react';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface StudentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  logs: HifzLog[];
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  isOpen,
  onClose,
  student,
  logs
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  if (!isOpen || !student) return null;

  const studentLogs = logs.filter(l => l.studentId === student.id || l.studentCode === student.code);
  const percentComplete = Math.round((student.juzLevel / 30) * 100);
  const filename = `Markazul_Furqan_Transcript_${student.code}_${student.name.replace(/\s+/g, '_')}.pdf`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(reportRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 6
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenShare = async () => {
    if (!reportRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(reportRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 6
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('PDF Blob generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 no-print">
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0F5132]" />
                <span>Academic Transcript & Progress Report</span>
              </h3>
              <p className="text-xs text-gray-500">Official verified student evaluation dossier</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download high-resolution PDF file directly"
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
                title="Share PDF or save directly to Google Drive"
              >
                <Share2 className="w-4 h-4 text-indigo-200" />
                <span>Share & Drive</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-3 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                title="Print document or save to PDF via system print dialog"
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

          {/* The Printable Official Transcript */}
          <div 
            ref={reportRef}
            className="printable-document relative bg-white p-6 sm:p-8 border-2 border-[#D4AF37] rounded-3xl text-gray-800 space-y-6 my-4 shadow-sm"
          >
            {/* Subtle Institutional Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Al-Furqan Watermark" 
                className="w-96 h-96 object-contain"
              />
            </div>

            {/* Institutional Header */}
            <div className="relative border-b-2 border-[#D4AF37] pb-5 text-center space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-0.5 shadow-sm bg-white overflow-hidden">
                  <img 
                    src={OFFICIAL_LOGO_URL} 
                    alt="Emblem" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <h2 className="text-xl font-black text-[#0A3622] tracking-wide">
                MARKAZUL FURQAN QURANIC ACADEMY
              </h2>
              <p className="text-xs font-bold text-gray-700">
                مركز الفرقان لتحفيظ القرآن الكريم والعلوم الشرعية • تشيرو، إثيوبيا
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                P.O. Box 112, Chiro (Asebe Teferi), West Hararghe, Ethiopia
              </p>
              <div className="pt-2">
                <span className="bg-[#0F5132] text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  Official Academic Transcript
                </span>
              </div>
            </div>

            {/* Student Dossier Information */}
            <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FDFBF7] p-4 rounded-2xl border border-gray-200/80 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Candidate Name</span>
                <span className="font-extrabold text-gray-900">{student.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Institutional Code</span>
                <span className="font-mono font-black text-[#0F5132]">{student.code}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Halaqah Group</span>
                <span className="font-bold text-gray-900">{student.halaqahGroup}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Age / Gender</span>
                <span className="font-bold text-gray-800">{student.age} yrs • {student.gender}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Academic Track</span>
                <span className="font-bold text-gray-800">{student.track}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Current Enrollment</span>
                <span className="font-bold text-gray-800">{student.enrollmentDate}</span>
              </div>
            </div>

            {/* Memorization Progress Overview */}
            <div className="relative border border-gray-200 rounded-2xl p-4 bg-white shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-gray-900">Quranic Memorization Milestone</span>
                <span className="font-black text-[#0F5132] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Juz {student.juzLevel} of 30 Completed ({percentComplete}%)
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                <div 
                  className="bg-linear-to-r from-[#0F5132] to-[#145A32] h-full rounded-full transition-all duration-700"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Current Sabaq</span>
                  <span className="font-bold text-[#0F5132]">{student.currentSurah}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Daily Attendance</span>
                  <span className="font-bold text-emerald-800">{student.dailyAttendance}% Average</span>
                </div>
                <div className="bg-gray-50 p-2 rounded-xl text-center col-span-2 sm:col-span-1">
                  <span className="text-gray-400 block text-[9px] uppercase font-bold">Registry Status</span>
                  <span className="font-black text-amber-900">{student.status}</span>
                </div>
              </div>
            </div>

            {/* Recent Sabaq Evaluated Logs */}
            <div className="relative space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
                  Recent Evaluated Recitation Logs (Faculty Audit)
                </span>
                <span className="text-[10px] text-gray-500">{studentLogs.length} verified sessions</span>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 text-[10px] uppercase font-bold border-b border-gray-200">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Sabaq (New Lesson)</th>
                      <th className="py-2 px-3">Sabqi / Manzil</th>
                      <th className="py-2 px-3">Grade</th>
                      <th className="py-2 px-3">Mu'allim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-[11px]">
                    {studentLogs.slice(0, 5).map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50">
                        <td className="py-2 px-3 font-mono text-gray-600">{log.date}</td>
                        <td className="py-2 px-3 font-bold text-gray-900">{log.sabaqRange}</td>
                        <td className="py-2 px-3 text-gray-600">Juz {log.sabqiJuz} / {log.manzilJuz}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black ${
                            log.grade === 'MUMTAZ'
                              ? 'bg-emerald-100 text-emerald-900'
                              : log.grade === 'JAYYID_JIDDAN'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {log.grade.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-gray-600">{log.muallimName}</td>
                      </tr>
                    ))}
                    {studentLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-400 italic">
                          No recent logs recorded for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Certification & Signatures */}
            <div className="relative pt-4 border-t border-gray-200 flex justify-between items-end text-xs">
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block">Lead Halaqah Mu'allim</span>
                <span className="font-serif italic text-gray-600">Ustadh Ubayy ibn Ka'ab</span>
                <span className="text-[10px] text-gray-400 block">Academic Examiner Signature</span>
              </div>

              <div className="text-center space-y-1">
                <div className="w-16 h-16 border border-dashed border-[#D4AF37] rounded-full mx-auto flex items-center justify-center p-1">
                  <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center text-[7px] text-[#0A3622] font-black uppercase text-center leading-tight">
                    Official Stamp
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 uppercase font-bold">Chiro Seal</span>
              </div>

              <div className="text-right space-y-1">
                <span className="font-bold text-gray-900 block">Academy Director</span>
                <span className="font-serif italic text-gray-600">Sheikh Ibrahim Chiro</span>
                <span className="text-[10px] text-gray-400 block">Markazul Furqan Executive</span>
              </div>
            </div>

          </div>

          {/* Modal Footer (No Print) */}
          <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-100 no-print">
            <span className="font-mono text-[10px]">Doc ID: MF-DOC-{student.code}-{new Date().getFullYear()}</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`Academic Transcript: ${student.name} (${student.code})`}
        filename={filename}
        blob={pdfBlob || undefined}
        recipientPhone={student.guardianPhone}
        summaryText={`Official verified academic transcript for ${student.name} (${student.code}). Hifz Progress: Juz ${student.juzLevel}/30 (${percentComplete}%). Attendance: ${student.dailyAttendance}%.`}
      />
    </>
  );
};
