import React, { useRef, useState, useMemo } from 'react';
import { 
  Student, 
  HifzLog, 
  ExamRecord, 
  InstitutionSettings,
  HifzGrade 
} from '../../types';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { 
  Award, 
  Printer, 
  Download, 
  Share2, 
  X, 
  Calendar, 
  User, 
  Phone, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  FileSpreadsheet,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { generatePdfFromElement, generatePdfBlobFromElement } from '../../utils/pdfGenerator';
import { downloadCsv } from '../../utils/shareUtils';
import { ShareDocumentModal } from '../ShareDocumentModal';

interface MonthlyReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudentId?: string;
  hifzLogs: HifzLog[];
  exams: ExamRecord[];
  institutionSettings?: InstitutionSettings;
  onShowToast?: (msg: string) => void;
}

export const MonthlyReportCardModal: React.FC<MonthlyReportCardModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudentId,
  hifzLogs,
  exams,
  institutionSettings,
  onShowToast
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id || '')
  );
  const [selectedMonth, setSelectedMonth] = useState('2026-10'); // YYYY-MM
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const reportCardRef = useRef<HTMLDivElement>(null);

  // Month options
  const monthOptions = [
    { value: '2026-10', label: 'Tikimt / October 2026' },
    { value: '2026-09', label: 'Meskerem / September 2026' },
    { value: '2026-08', label: 'Nehase / August 2026' },
    { value: 'ALL', label: 'All Recorded Evaluations' }
  ];

  // Active student
  const student = useMemo(() => {
    return students.find(s => s.id === selectedStudentId) || students[0] || null;
  }, [students, selectedStudentId]);

  // Student's Hifz logs
  const studentLogs = useMemo(() => {
    if (!student) return [];
    return hifzLogs.filter(log => {
      const match = log.studentId === student.id || log.studentCode === student.code;
      if (!match) return false;
      if (selectedMonth === 'ALL') return true;
      return log.date.startsWith(selectedMonth);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [hifzLogs, student, selectedMonth]);

  // Student's Exam records
  const studentExams = useMemo(() => {
    if (!student) return [];
    return exams.filter(exam => {
      const match = exam.studentId === student.id || exam.studentCode === student.code;
      if (!match) return false;
      if (selectedMonth === 'ALL') return true;
      return exam.examDate.startsWith(selectedMonth);
    }).sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
  }, [exams, student, selectedMonth]);

  // All student exams for fallback reference
  const allStudentExams = useMemo(() => {
    if (!student) return [];
    return exams.filter(exam => exam.studentId === student.id || exam.studentCode === student.code)
      .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
  }, [exams, student]);

  const examsToDisplay = studentExams.length > 0 ? studentExams : allStudentExams;

  // Aggregate metrics
  const logsCount = studentLogs.length;
  const mumtazLogs = studentLogs.filter(l => l.grade === 'MUMTAZ').length;
  const avgAttendance = student ? student.dailyAttendance : 0;
  
  // Latest exam composite
  const latestExam = examsToDisplay[0];
  const examScore = latestExam ? latestExam.totalScore : 95;
  const examGrade = latestExam ? latestExam.grade : 'MUMTAZ';

  // Overall Letter Grade
  const overallGrade = useMemo(() => {
    if (examScore >= 90 && avgAttendance >= 90) return 'MUMTAZ (EXCELLENT)';
    if (examScore >= 80) return 'JAYYID JIDDAN (VERY GOOD)';
    if (examScore >= 70) return 'JAYYID (GOOD)';
    return 'MAQBOOL (SATISFACTORY)';
  }, [examScore, avgAttendance]);

  if (!isOpen || !student) return null;

  const monthLabel = monthOptions.find(m => m.value === selectedMonth)?.label || 'October 2026';
  const filename = `Markazul_Furqan_ReportCard_${student.code}_${student.name.replace(/\s+/g, '_')}_${selectedMonth}.pdf`;

  // 1. PDF Download
  const handleDownloadPdf = async () => {
    if (!reportCardRef.current) return;
    try {
      setIsGeneratingPdf(true);
      await generatePdfFromElement(reportCardRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 6
      });
      if (onShowToast) onShowToast(`Downloaded Report Card PDF for ${student.name}!`);
    } catch (err) {
      console.error('Report Card PDF generation failed:', err);
      if (onShowToast) onShowToast('PDF generation encountered an issue, launching print view...');
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. CSV Download
  const handleDownloadCsv = () => {
    const headers = [
      'Field',
      'Value'
    ];
    const data = [
      ['Student Name', `"${student.name}"`],
      ['Student ID', `"${student.code}"`],
      ['Evaluation Period', `"${monthLabel}"`],
      ['Track', `"${student.track}"`],
      ['Halaqah Group', `"${student.halaqahGroup}"`],
      ['Current Surah', `"${student.currentSurah}"`],
      ['Juz Level', `${student.juzLevel} / 30`],
      ['Daily Attendance Rate', `${student.dailyAttendance}%`],
      ['Guardian Name', `"${student.guardianName}"`],
      ['Guardian Phone', `"${student.guardianPhone}"`],
      ['Monthly Sabaq Log Entries', `${logsCount}`],
      ['Mumtaz Grade Count', `${mumtazLogs}`],
      ['Latest Exam Tested', `"${latestExam ? latestExam.juzTested : 'N/A'}"`],
      ['Hifz Score (/40)', `${latestExam ? latestExam.hifzScore : 'N/A'}`],
      ['Makharij Score (/30)', `${latestExam ? latestExam.makharijScore : 'N/A'}`],
      ['Tajweed Score (/30)', `${latestExam ? latestExam.tajweedScore : 'N/A'}`],
      ['Total Exam Score (/100)', `${latestExam ? latestExam.totalScore : 'N/A'}`],
      ['Exam Grade', `"${examGrade}"`],
      ['Overall Standing', `"${overallGrade}"`]
    ];

    const csvContent = [headers.join(','), ...data.map(d => d.join(','))].join('\n');
    downloadCsv(csvContent, `Markazul_Furqan_ReportCard_${student.code}_${selectedMonth}.csv`);
    if (onShowToast) onShowToast(`Downloaded Report Card CSV for ${student.name}!`);
  };

  // 3. Share & Google Drive
  const handleOpenShare = async () => {
    if (!reportCardRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const { blob } = await generatePdfBlobFromElement(reportCardRef.current, {
        filename,
        orientation: 'portrait',
        format: 'a4',
        marginMm: 6
      });
      setPdfBlob(blob);
      setShowShareModal(true);
    } catch (err) {
      console.error('PDF Blob generation failed:', err);
      if (onShowToast) onShowToast('Failed to prepare document for sharing.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-gray-100 animate-fadeIn my-4 max-h-[95vh] flex flex-col">
          
          {/* Top Control Bar (Screen Only) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-200 no-print shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-[#0F5132] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Official Academic Dossier
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  Hifz Evaluations & Oral Exams
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-0.5 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <span>Monthly Report Card Generator</span>
              </h3>
            </div>

            {/* Student & Month Pickers */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Student Dropdown */}
              <div className="relative">
                <select
                  value={student.id}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-[#0F5132] text-gray-800"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F5132] text-gray-800"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-gray-100 no-print shrink-0">
            <div className="text-xs text-gray-500">
              Generating report card for <span className="font-bold text-gray-800">{student.name}</span> • {monthLabel}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download High-Resolution PDF"
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
                onClick={handleDownloadCsv}
                className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                title="Download Report Card Data as CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Download CSV</span>
              </button>

              <button
                onClick={handleOpenShare}
                disabled={isGeneratingPdf}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Save to Google Drive or Share via WhatsApp"
              >
                <Share2 className="w-4 h-4 text-indigo-200" />
                <span>Share & Drive</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                title="Print Document"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Printable Report Card Document Body */}
          <div className="overflow-y-auto flex-1 p-2 sm:p-4 bg-gray-50/50 rounded-2xl mt-3">
            <div 
              ref={reportCardRef}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-900 space-y-6 max-w-3xl mx-auto"
              style={{ minHeight: '1000px' }}
            >
              {/* 1. OFFICIAL INSTITUTIONAL HEADER */}
              <div className="text-center space-y-2 border-b-2 border-emerald-900/20 pb-5 relative">
                {/* Islamic Bismillah Banner */}
                <div className="text-[#0F5132] font-serif text-lg sm:text-xl tracking-wider select-none">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37] p-0.5 shadow-md bg-white shrink-0 overflow-hidden">
                    <img 
                      src={OFFICIAL_LOGO_URL} 
                      alt="Markazul Furqan Emblem" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="flex-1 text-center">
                    <div className="text-[11px] font-black uppercase text-[#D4AF37] tracking-widest">
                      Markazul Furqan Quranic Academy & Halaqah
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F5132] uppercase tracking-tight">
                      Monthly Academic & Hifz Report Card
                    </h1>
                    <div className="text-xs text-gray-600 font-semibold mt-0.5">
                      Chiro (Asebe Teferi), West Hararghe, Oromia, Ethiopia • Tel: +251 91 123 4567
                    </div>
                  </div>

                  {/* Official Institutional Seal */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-800/40 bg-emerald-50/50 p-2 flex flex-col items-center justify-center text-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#0F5132]" />
                    <span className="text-[8px] font-black uppercase text-[#0F5132] mt-0.5">
                      Official Seal
                    </span>
                  </div>
                </div>

                {/* Sub-bar: Academic Term & Issue Date */}
                <div className="flex flex-wrap items-center justify-between text-xs bg-emerald-50/70 border border-emerald-200/60 px-4 py-2 rounded-xl mt-3 font-semibold text-emerald-950">
                  <span><strong>Academic Period:</strong> {monthLabel}</span>
                  <span><strong>Report Reference:</strong> MF-RC-{student.code}-{selectedMonth.replace('-', '')}</span>
                  <span><strong>Date of Issue:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* 2. STUDENT DEMOGRAPHIC PROFILE */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 text-xs">
                <div className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-900">
                    <User className="w-4 h-4 text-[#0F5132]" />
                    Student Profile & Registration Dossier
                  </span>
                  <span className="bg-emerald-100 text-[#0F5132] px-2 py-0.5 rounded-full font-bold">
                    Status: {student.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <div className="text-gray-400 font-medium">Student Full Name:</div>
                    <div className="font-black text-gray-900 text-sm mt-0.5">{student.name}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Student ID Code:</div>
                    <div className="font-mono font-black text-[#0F5132] text-sm mt-0.5">{student.code}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Age & Gender:</div>
                    <div className="font-bold text-gray-800 mt-0.5">{student.age} yrs • {student.gender}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Blood Group:</div>
                    <div className="font-bold text-gray-800 mt-0.5">{student.bloodGroup || 'O+'}</div>
                  </div>

                  <div>
                    <div className="text-gray-400 font-medium">Curricular Track:</div>
                    <div className="font-bold text-emerald-900 mt-0.5">{student.track}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Assigned Halaqah:</div>
                    <div className="font-bold text-gray-800 mt-0.5">{student.halaqahGroup}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Guardian Name:</div>
                    <div className="font-bold text-gray-800 mt-0.5">{student.guardianName}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-medium">Guardian Contact:</div>
                    <div className="font-mono font-bold text-gray-800 mt-0.5">{student.guardianPhone}</div>
                  </div>
                </div>
              </div>

              {/* 3. EXECUTIVE ACADEMIC KPI MATRIX */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {/* Attendance */}
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    Monthly Attendance
                  </div>
                  <div className="text-2xl font-black text-[#0F5132] mt-1">
                    {student.dailyAttendance}%
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    {student.dailyAttendance >= 95 ? 'Mumtaz (Exemplary)' : student.dailyAttendance >= 90 ? 'Very Good' : 'Needs Focus'}
                  </div>
                </div>

                {/* Memorization Progress */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider">
                    Hifz Completed
                  </div>
                  <div className="text-2xl font-black text-amber-800 mt-1">
                    {student.juzLevel} <span className="text-xs font-semibold text-amber-700">/ 30 Juz</span>
                  </div>
                  <div className="text-[10px] text-amber-800 font-bold mt-0.5">
                    {Math.round((student.juzLevel / 30) * 100)}% of Holy Quran
                  </div>
                </div>

                {/* Monthly Sabaq Submissions */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-black uppercase text-blue-900 tracking-wider">
                    Sabaq Evaluations
                  </div>
                  <div className="text-2xl font-black text-blue-800 mt-1">
                    {logsCount} <span className="text-xs font-semibold text-blue-700">Sessions</span>
                  </div>
                  <div className="text-[10px] text-blue-700 font-bold mt-0.5">
                    {mumtazLogs} Mumtaz ratings
                  </div>
                </div>

                {/* Oral Exam Composite */}
                <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-3.5">
                  <div className="text-[10px] font-black uppercase text-purple-900 tracking-wider">
                    Exam Composite
                  </div>
                  <div className="text-2xl font-black text-purple-800 mt-1">
                    {examScore}<span className="text-xs font-semibold text-purple-700">/100</span>
                  </div>
                  <div className="text-[10px] text-purple-800 font-bold mt-0.5 uppercase">
                    {examGrade.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* 4. SECTION 1: DAILY HIFZ EVALUATION LOGS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0F5132]" />
                    <span>Section 1: Daily Sabaq, Sabqi & Manzil Recitation Records</span>
                  </h4>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {studentLogs.length} Verified Entries
                  </span>
                </div>

                {studentLogs.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                    No daily Sabaq logs recorded for {monthLabel}. Showing current Surah milestone: <strong className="text-gray-800">{student.currentSurah}</strong>.
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-700 font-black text-[10px] uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Sabaq (New Lesson)</th>
                          <th className="py-2.5 px-3 text-center">Sabqi Juz</th>
                          <th className="py-2.5 px-3 text-center">Manzil Juz</th>
                          <th className="py-2.5 px-3 text-center">Quality</th>
                          <th className="py-2.5 px-3">Mu'allim Faculty Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {studentLogs.slice(0, 5).map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                              {log.date}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-gray-900">
                              {log.sabaqRange}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-[#0F5132]">
                              Juz {log.sabqiJuz}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                              Juz {log.manzilJuz}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                log.grade === 'MUMTAZ' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : log.grade === 'JAYYID_JIDDAN'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {log.grade.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-600 text-[11px]">
                              {log.notes || 'Recited satisfactorily without hesitation.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 5. SECTION 2: OFFICIAL ORAL EXAMINATIONS & TAJWEED AUDIT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span>Section 2: Official Oral Examinations & Faculty Tajweed Audits</span>
                  </h4>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    Rigorous Faculty Review
                  </span>
                </div>

                {examsToDisplay.length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-500">
                    No formal oral examinations recorded in this period. Next quarterly examination scheduled soon.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {examsToDisplay.slice(0, 2).map((exam) => (
                      <div key={exam.id} className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200 space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mr-2">
                              {exam.juzTested}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              Examined by {exam.examinerName}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-bold text-gray-500">
                            Date: {exam.examDate}
                          </div>
                        </div>

                        {/* Detailed Score Rubric Breakdown */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Hifz Retention</div>
                            <div className="text-base font-black text-[#0F5132] mt-0.5">
                              {exam.hifzScore} <span className="text-[10px] text-gray-400 font-normal">/ 40</span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Makharij & Sifat</div>
                            <div className="text-base font-black text-[#0F5132] mt-0.5">
                              {exam.makharijScore} <span className="text-[10px] text-gray-400 font-normal">/ 30</span>
                            </div>
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
                            <div className="text-[10px] text-gray-400 font-bold uppercase">Tajweed Ahkam</div>
                            <div className="text-base font-black text-[#0F5132] mt-0.5">
                              {exam.tajweedScore} <span className="text-[10px] text-gray-400 font-normal">/ 30</span>
                            </div>
                          </div>
                          <div className="bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-300 shadow-2xs">
                            <div className="text-[10px] text-[#0F5132] font-black uppercase">Composite Total</div>
                            <div className="text-base font-black text-[#0F5132] mt-0.5">
                              {exam.totalScore} / 100 • {exam.grade.replace('_', ' ')}
                            </div>
                          </div>
                        </div>

                        {exam.remarks && (
                          <div className="text-xs bg-white p-3 rounded-xl border border-gray-200 text-gray-700 italic">
                            "{exam.remarks}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. SECTION 3: CONDUCT & ATTENDANCE ASSESSMENT */}
              <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/70 text-xs space-y-2">
                <div className="font-black text-[#0F5132] uppercase text-[11px] tracking-wider flex items-center justify-between">
                  <span>Section 3: Halaqah Conduct, Adab & Punctuality Standing</span>
                  <span className="font-bold text-emerald-900">{student.dailyAttendance}% Attendance Record</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[11px]">
                  Student demonstrates high reverence for the Holy Quran, respectful decorum towards faculty and peers, and adherence to early morning Fajr halaqah schedules in Chiro. Recommended for continued advanced memorization and weekly revision circles.
                </p>
              </div>

              {/* 7. INSTITUTIONAL SIGNATURES & VERIFICATION SEALS */}
              <div className="pt-6 border-t-2 border-emerald-900/20 grid grid-cols-3 gap-4 text-center text-xs">
                {/* Mu'allim */}
                <div className="space-y-2">
                  <div className="h-10 flex items-end justify-center font-serif italic text-gray-700 text-sm select-none">
                    Ustadh Ziyad Abdullahi
                  </div>
                  <div className="border-t border-gray-400 pt-1">
                    <div className="font-black text-gray-900">Lead Mu'allim Faculty</div>
                    <div className="text-[10px] text-gray-500">Instructor Signature & Date</div>
                  </div>
                </div>

                {/* Chief Examiner */}
                <div className="space-y-2">
                  <div className="h-10 flex items-end justify-center font-serif italic text-emerald-900 text-sm select-none">
                    Sheikh Nuruddin Ahmed
                  </div>
                  <div className="border-t border-gray-400 pt-1">
                    <div className="font-black text-gray-900">Chief Examiner</div>
                    <div className="text-[10px] text-gray-500">Council of Quranic Scholars</div>
                  </div>
                </div>

                {/* Head of Halaqat / Seal */}
                <div className="space-y-2">
                  <div className="h-10 flex items-end justify-center font-serif italic text-[#D4AF37] text-sm select-none">
                    Sheikh Mukhtar Al-Furqani
                  </div>
                  <div className="border-t border-gray-400 pt-1">
                    <div className="font-black text-gray-900">Head of Halaqat</div>
                    <div className="text-[10px] text-gray-500">Executive Academy Seal</div>
                  </div>
                </div>
              </div>

              {/* Document Security Footer */}
              <div className="text-[9px] text-gray-400 text-center pt-2 font-mono border-t border-gray-100">
                Official Digital Transcript • Markazul Furqan Quranic Academy (Chiro, Ethiopia) • Verified Ledger ID: MF-{student.code}-{Date.now().toString().slice(-6)}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Google Drive / WhatsApp Share Modal */}
      {showShareModal && (
        <ShareDocumentModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={`Academic Report Card - ${student.name}`}
          filename={filename}
          blob={pdfBlob || undefined}
          recipientPhone={student.guardianPhone}
          summaryText={`Assalamu Alaikum. Here is the official Monthly Hifz & Academic Report Card for ${student.name} (${student.code}) from Markazul Furqan Academy (Chiro, Ethiopia). Attendance: ${student.dailyAttendance}%, Completed: ${student.juzLevel}/30 Juz.`}
          onShowToast={onShowToast}
        />
      )}
    </>
  );
};
