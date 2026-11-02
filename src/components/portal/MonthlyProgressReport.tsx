import React, { useState, useRef } from 'react';
import { Student, HifzLog } from '../../types';
import { Award, Printer, TrendingUp, Users, Calendar, Eye, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { generatePdfFromElement } from '../../utils/pdfGenerator';

interface MonthlyProgressReportProps {
  students: Student[];
  hifzLogs: HifzLog[];
  onSelectStudent: (student: Student) => void;
  onOpenReportModal: (student: Student) => void;
  onOpenCertModal: (student: Student) => void;
}

export const MonthlyProgressReport: React.FC<MonthlyProgressReportProps> = ({
  students,
  hifzLogs,
  onSelectStudent,
  onOpenReportModal,
  onOpenCertModal
}) => {
  const [selectedMonth, setSelectedMonth] = useState('October / Tikimt 2026');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const auditRef = useRef<HTMLDivElement>(null);

  // Compute metrics
  const total = students.length || 1;
  const avgJuz = (students.reduce((a, b) => a + b.juzLevel, 0) / total).toFixed(1);
  const avgAttendance = Math.round(students.reduce((a, b) => a + b.dailyAttendance, 0) / total);
  const khatmCandidates = students.filter(s => s.juzLevel >= 25);
  const topPerformers = [...students].sort((a, b) => b.juzLevel - a.juzLevel).slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!auditRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(auditRef.current, {
        filename: `Markazul_Furqan_Monthly_Audit_${selectedMonth.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 6
      });
    } catch (err) {
      console.error('Audit PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Summary Top Bar */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Monthly Academic Audit & Cohort Progress Report
            </h3>
            <span className="bg-emerald-100 text-[#0F5132] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Halaqah Review
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Institutional memorization velocity, attendance fidelity, and faculty evaluation summaries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0F5132]"
          >
            <option value="October / Tikimt 2026">October / Tikimt 2026</option>
            <option value="September / Meskerem 2026">September / Meskerem 2026</option>
            <option value="August / Nehase 2026">August / Nehase 2026</option>
          </select>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Download full monthly audit report as high-resolution PDF"
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
            onClick={handlePrint}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div ref={auditRef} className="printable-document space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
        
        {/* Printable Institutional Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-[#D4AF37] pb-4 gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white p-0.5 shadow-sm shrink-0">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Al-Furqan Official Emblem" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div>
              <div className="text-xs font-arabic font-bold text-[#0F5132]">
                مركز الفرقان لتحفيظ القرآن الكريم - جرو - إثيوبيا
              </div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide">
                Markazul Furqan Quranic & Academic Institution
              </h2>
              <p className="text-xs text-gray-500 font-bold">
                Monthly Cohort Mastery & Academic Audit Ledger • {selectedMonth}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] bg-[#0F5132] text-white font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Institutional Audit
            </span>
            <span className="block text-[11px] font-mono text-gray-500 mt-1">
              Date: {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Active Chiro Cohort</span>
            <div className="text-2xl font-black text-[#0F5132] mt-1">{students.length} Students</div>
            <span className="text-[10px] text-emerald-600 block mt-0.5">100% Enrollment Retention</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Mean Hifz Mastery</span>
            <div className="text-2xl font-black text-amber-900 mt-1">Juz {avgJuz} / 30</div>
            <span className="text-[10px] text-amber-700 block mt-0.5">+1.4 Juz monthly velocity</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-sky-800 uppercase block">Mean Roll Attendance</span>
            <div className="text-2xl font-black text-sky-900 mt-1">{avgAttendance}%</div>
            <span className="text-[10px] text-sky-700 block mt-0.5">Morning & evening sessions</span>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-purple-800 uppercase block">Khatm Track Scholars</span>
            <div className="text-2xl font-black text-purple-900 mt-1">{khatmCandidates.length} Haffaz</div>
            <span className="text-[10px] text-purple-700 block mt-0.5">Juz 25 to 30 completion</span>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h4 className="text-sm font-extrabold text-gray-900">
                Outstanding Hifz Honors & Khatm Leaders ({selectedMonth})
              </h4>
              <p className="text-xs text-gray-500">Students eligible for milestone awards & Sanad ijaza tracks</p>
            </div>
            <span className="bg-[#D4AF37]/20 text-amber-950 text-xs font-black px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Honor Roll
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-[#0F5132] text-white uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Track & Halaqah</th>
                  <th className="py-3 px-4">Juz Progress</th>
                  <th className="py-3 px-4">Roll Attendance</th>
                  <th className="py-3 px-4">Current Recitation</th>
                  <th className="py-3 px-4 text-center no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPerformers.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-black text-amber-700">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>{st.name}</div>
                      <span className="font-mono text-[10px] text-gray-400">{st.code}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">
                      <div>{st.track}</div>
                      <span className="text-[10px] text-gray-400">{st.halaqahGroup}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded text-[11px]">
                        Juz {st.juzLevel} / 30
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#0F5132]">
                      {st.dailyAttendance}%
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {st.currentSurah}
                    </td>
                    <td className="py-3.5 px-4 text-center no-print">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectStudent(st)}
                          className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          title="View Full Student Dossier"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => onOpenReportModal(st)}
                          className="bg-[#0F5132] hover:bg-[#0A3622] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Print Transcript"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Transcript</span>
                        </button>
                        <button
                          onClick={() => onOpenCertModal(st)}
                          className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer"
                          title="Issue Milestone Certificate"
                        >
                          <Award className="w-3 h-3 text-amber-950" />
                          <span>Award</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Signatures in Audit */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="h-8 border-b border-gray-400 w-44 mb-1" />
            <span className="text-[10px] text-gray-600 font-bold block">
              Director of Academic Affairs
            </span>
            <span className="text-[9px] text-gray-400">Markazul Furqan • Chiro Campus</span>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="h-8 border-b border-gray-400 w-44 mb-1" />
            <span className="text-[10px] text-gray-600 font-bold block">
              Board of Trustees & Oversight
            </span>
            <span className="text-[9px] text-gray-400">Hararghe Quranic Endowment</span>
          </div>
        </div>
      </div>
    </div>
  );
};
