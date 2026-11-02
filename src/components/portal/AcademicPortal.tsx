import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileSignature, 
  Heart, 
  Database, 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  Search, 
  Filter, 
  ShieldCheck, 
  Award, 
  ArrowLeft, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw, 
  Phone, 
  Calendar, 
  ChevronRight, 
  ExternalLink, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  FileText, 
  MessageCircle, 
  CreditCard, 
  DollarSign, 
  Cloud,
  Edit3,
  Settings,
  BarChart3,
  Share2,
  X
} from 'lucide-react';
import { 
  Student, 
  HifzLog, 
  AdmissionApplication, 
  DonationPledge, 
  CloudConfig, 
  UserSession,
  ExamRecord,
  TuitionRecord,
  InstitutionSettings
} from '../../types';
import { StudentReportModal } from './StudentReportModal';
import { HifzLogModal } from './HifzLogModal';
import { AddStudentModal } from './AddStudentModal';
import { CertificateGenerator } from './CertificateGenerator';
import { HifzProgressChart } from './HifzProgressChart';
import { StudentDetailChart } from './StudentDetailChart';
import { StudentDetailModal } from './StudentDetailModal';
import { AttendanceModal } from './AttendanceModal';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { MonthlyProgressReport } from './MonthlyProgressReport';
import { MonthlyPerformanceReport } from './MonthlyPerformanceReport';
import { MonthlyReportCardModal } from './MonthlyReportCardModal';
import { AttendanceTrendsDashboard } from './AttendanceTrendsDashboard';
import { GuardianNotifierModal } from './GuardianNotifierModal';
import { StudentIDCardModal } from './StudentIDCardModal';
import { EditStudentModal } from './EditStudentModal';
import { AdminSettingsModal } from './AdminSettingsModal';
import { ShareDocumentModal } from '../ShareDocumentModal';
import { 
  generateWhatsAppUrl, 
  generateSmsUrl, 
  buildDailySabaqMessage, 
  buildAttendanceAlertMessage 
} from '../../utils/messaging';
import { ExamRubricModal } from './ExamRubricModal';
import { TuitionLedgerModal } from './TuitionLedgerModal';
import { ReceiptModal } from '../ReceiptModal';
import { OFFICIAL_LOGO_URL, INITIAL_EXAMS, INITIAL_TUITION } from '../../data/initialData';

interface AcademicPortalProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'dailyAttendance'>) => Promise<void>;
  onDeleteStudent: (id: string) => void;
  onUpdateStudent?: (student: Student) => Promise<void> | void;
  hifzLogs: HifzLog[];
  onAddHifzLog: (log: Omit<HifzLog, 'id' | 'date'>) => Promise<void>;
  admissions: AdmissionApplication[];
  onApproveAdmission: (admissionId: string) => void;
  pledges: DonationPledge[];
  cloudConfig: CloudConfig;
  onOpenCloudConfig: () => void;
  onExitPortal: () => void;
  currentUser: UserSession | null;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  onResetData: () => void;
  onShowToast?: (msg: string) => void;
  onUpdateAttendance?: (updatedStudents: Student[]) => Promise<void> | void;
  exams?: ExamRecord[];
  onSaveExam?: (exam: ExamRecord) => Promise<void> | void;
  tuitionRecords?: TuitionRecord[];
  onSaveTuition?: (record: TuitionRecord) => Promise<void> | void;
  isFirestoreConnected?: boolean;
  onSeedCloudData?: () => Promise<void> | void;
  onOpenGoogleSheetsSync?: () => void;
  institutionSettings?: InstitutionSettings;
  onSaveSettings?: (settings: InstitutionSettings) => Promise<void> | void;
  cloudSyncStatus?: 'SYNCED' | 'SYNCING' | 'OFFLINE';
  onOpenPublishGuide?: () => void;
}

export const AcademicPortal: React.FC<AcademicPortalProps> = ({
  students,
  onAddStudent,
  onDeleteStudent,
  onUpdateStudent,
  hifzLogs,
  onAddHifzLog,
  admissions,
  onApproveAdmission,
  pledges,
  cloudConfig,
  onOpenCloudConfig,
  onExitPortal,
  currentUser,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  onShowToast,
  onUpdateAttendance,
  exams = INITIAL_EXAMS,
  onSaveExam,
  tuitionRecords = INITIAL_TUITION,
  onSaveTuition,
  isFirestoreConnected = true,
  onSeedCloudData,
  onOpenGoogleSheetsSync,
  institutionSettings,
  onSaveSettings,
  cloudSyncStatus = 'SYNCED',
  onOpenPublishGuide
}) => {
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'ATTENDANCE_TRENDS' | 'LOGS' | 'EXAMS' | 'TUITION' | 'REPORTS' | 'ADMISSIONS' | 'PLEDGES' | 'BACKUP'>('ROSTER');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJuz, setFilterJuz] = useState<'ALL' | '1-10' | '11-20' | '21-30'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [statusFilterMode, setStatusFilterMode] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showHifzLogModal, setShowHifzLogModal] = useState(false);
  const [selectedStudentForLog, setSelectedStudentForLog] = useState<Student | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPledgeForReceipt, setSelectedPledgeForReceipt] = useState<DonationPledge | null>(null);

  // Edit & Admin Settings Modal states
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);

  // Additional feature modals
  const [showNotifierModal, setShowNotifierModal] = useState(false);
  const [selectedStudentForNotifier, setSelectedStudentForNotifier] = useState<Student | null>(null);
  const [showIDCardModal, setShowIDCardModal] = useState(false);
  const [selectedStudentForIDCard, setSelectedStudentForIDCard] = useState<Student | null>(null);
  const [showExamModal, setShowExamModal] = useState(false);
  const [selectedStudentForExam, setSelectedStudentForExam] = useState<Student | null>(null);
  const [showTuitionModal, setShowTuitionModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedStudentForPerformance, setSelectedStudentForPerformance] = useState<Student | null>(null);
  const [showReportCardModal, setShowReportCardModal] = useState(false);
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<Student | null>(null);
  const [reportsViewMode, setReportsViewMode] = useState<'PERFORMANCE' | 'COHORT'>('PERFORMANCE');
  const [showShareCsvModal, setShowShareCsvModal] = useState(false);

  // Compute full CSV data string for sharing & Google Drive backup
  const csvDataString = React.useMemo(() => {
    const headers = ['Student ID', 'Full Name', 'Age', 'Gender', 'Track', 'Current Surah', 'Juz Level', 'Attendance %', 'Guardian Name', 'Guardian Phone', 'Status', 'Halaqah Group'];
    const rows = students.map(s => [
      `"${s.code}"`,
      `"${s.name}"`,
      s.age,
      s.gender,
      `"${s.track}"`,
      `"${s.currentSurah}"`,
      s.juzLevel,
      `"${s.dailyAttendance}%"`,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      s.status,
      `"${s.halaqahGroup}"`
    ]);
    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }, [students]);

  // Student Detail View & Attendance states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Count active and inactive students for quick filter pills
  const activeCount = React.useMemo(() => 
    students.filter(s => s.status === 'ACTIVE' || s.status === 'KHATM_TRACK' || s.status === 'REVISION').length
  , [students]);

  const inactiveCount = React.useMemo(() => 
    students.filter(s => s.status === 'GRADUATED' || s.status === 'ON_LEAVE').length
  , [students]);

  // Filter students with search bar and active/inactive status filters
  const filteredStudents = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return students.filter(s => {
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.guardianPhone.includes(q) ||
        s.guardianName.toLowerCase().includes(q) ||
        s.track.toLowerCase().includes(q) ||
        s.currentSurah.toLowerCase().includes(q) ||
        s.halaqahGroup.toLowerCase().includes(q);

      let matchesJuz = true;
      if (filterJuz === '1-10') matchesJuz = s.juzLevel <= 10;
      else if (filterJuz === '11-20') matchesJuz = s.juzLevel > 10 && s.juzLevel <= 20;
      else if (filterJuz === '21-30') matchesJuz = s.juzLevel > 20;

      let matchesStatusMode = true;
      if (statusFilterMode === 'ACTIVE') {
        matchesStatusMode = s.status === 'ACTIVE' || s.status === 'KHATM_TRACK' || s.status === 'REVISION';
      } else if (statusFilterMode === 'INACTIVE') {
        matchesStatusMode = s.status === 'GRADUATED' || s.status === 'ON_LEAVE';
      }

      let matchesSpecificStatus = true;
      if (filterStatus !== 'ALL') {
        matchesSpecificStatus = s.status === filterStatus;
      }

      return matchesSearch && matchesJuz && matchesStatusMode && matchesSpecificStatus;
    });
  }, [students, searchQuery, filterJuz, statusFilterMode, filterStatus]);

  const handleOpenLogModal = (student?: Student) => {
    setSelectedStudentForLog(student || null);
    setShowHifzLogModal(true);
  };

  const handleOpenReportModal = (student: Student) => {
    setSelectedStudentForReport(student);
    setShowReportModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fadeIn">
      
      {/* 1. TOP PORTAL HEADER & NAVIGATION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-gray-200 no-print">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-md bg-white p-0.5 shrink-0">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Markazul Furqan Official Emblem" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#0F5132] bg-emerald-100 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Institutional Academic Console
              </span>
              {currentUser && (
                <span className="text-xs text-gray-500 font-semibold">
                  • Signed in as {currentUser.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Markazul Furqan Academic Ledger
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time management for Sabaq, Sabqi, and Manzil evaluations, student rosters, admissions, and verified transcripts.
            </p>
          </div>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Free-Tier Cloud Storage Sync Button */}
          {onSeedCloudData && (
            <button
              onClick={onSeedCloudData}
              className="bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer border border-emerald-500/70"
              title="Sync all local records to Firebase Free-Tier Firestore Cloud Storage"
            >
              <Cloud className="w-4 h-4 text-emerald-400" />
              <span>Cloud Sync</span>
            </button>
          )}

          {/* Standalone Publishing Guide */}
          {onOpenPublishGuide && (
            <button
              onClick={onOpenPublishGuide}
              className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-amber-900 border border-[#D4AF37] text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              title="How to publish outside Gemini / AI Studio on 100% Free Tier"
            >
              <span>Publish Free Guide</span>
            </button>
          )}

          {/* Google Sheets Live Sync Button */}
          <button
            onClick={onOpenGoogleSheetsSync || onOpenCloudConfig}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer border border-emerald-600"
            title="Open Google Sheets connection and real-time synchronization"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Google Sheets Sync</span>
          </button>

          {/* Admin / Owner Settings Button */}
          {institutionSettings && onSaveSettings && (
            <button
              onClick={() => setShowAdminSettingsModal(true)}
              className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              title="Edit Institution details, contact phone, social links, banking details, and tuition rates"
            >
              <Settings className="w-4 h-4 text-gray-950" />
              <span>Admin Settings</span>
            </button>
          )}

          <button
            onClick={() => handleOpenLogModal()}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Log Daily Sabaq</span>
          </button>

          <button
            onClick={() => setShowAttendanceModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Take daily roll call and update students daily attendance percentage"
          >
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span>Record Attendance</span>
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Open monthly progress summary and printable audit tables"
          >
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span>Monthly Reports</span>
          </button>

          <button
            onClick={() => {
              if (!selectedStudentForCert && students.length > 0) {
                setSelectedStudentForCert(students[0]);
              }
              setShowCertModal(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Generate and print official Hifz completion and milestone certificates"
          >
            <Award className="w-4 h-4 text-amber-200" />
            <span>Certificate</span>
          </button>

          <button
            onClick={() => {
              if (!selectedStudentForReportCard && students.length > 0) {
                setSelectedStudentForReportCard(students[0]);
              }
              setShowReportCardModal(true);
            }}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Generate official printable Monthly Report Card with Hifz logs and exam records"
          >
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Report Card</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForIDCard(students[0] || null);
              setShowIDCardModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-black px-3 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Generate Student ID Cards and Gate Passes"
          >
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
            <span>ID Passes</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForNotifier(students[0] || null);
              setShowNotifierModal(true);
            }}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-3 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Dispatch WhatsApp or SMS updates to student guardians"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Parent Alert</span>
          </button>

          <button
            onClick={() => {
              setSelectedStudentForExam(students[0] || null);
              setShowExamModal(true);
            }}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-3 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Oral Hifz & Tajweed Examination Grading Rubric"
          >
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Oral Exam</span>
          </button>

          <button
            onClick={() => setShowTuitionModal(true)}
            className="bg-purple-800 hover:bg-purple-900 text-white text-xs font-black px-3 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Tuition Ledger & Kafalat al-Yateem orphan sponsorships"
          >
            <DollarSign className="w-4 h-4 text-purple-200" />
            <span>Tuition & Kafalat</span>
          </button>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-950" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onExportCSV}
            className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Download full student ledger in Excel/CSV format"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowShareCsvModal(true)}
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            title="Share student ledger CSV or save directly to Google Drive"
          >
            <Share2 className="w-4 h-4 text-indigo-200" />
            <span>Share & Drive CSV</span>
          </button>

          <button
            onClick={onExitPortal}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6 no-print">
        {/* Total Registered Haffaz */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-1">
            <span>Total Enrolled Haffaz</span>
            <Users className="w-4 h-4 text-[#0F5132]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F5132]">
            {students.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Across 5 Chiro Halaqat
          </div>
        </div>

        {/* Today's Completed Sabaq Logs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-1">
            <span>Audited Sabaq Entries</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {hifzLogs.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Evaluated by Mu'allim faculty
          </div>
        </div>

        {/* Cloud Sync Status */}
        <div 
          onClick={onOpenGoogleSheetsSync || onOpenCloudConfig}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-[#0F5132] transition"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-1">
            <span>Google Sheets Cloud Link</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="text-xs font-black text-emerald-700 mt-2 flex items-center gap-1.5 truncate">
            <span>{cloudConfig.connectedSpreadsheetTitle ? cloudConfig.connectedSpreadsheetTitle : 'Google Sheets Ready'}</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
            <span>{cloudConfig.lastSyncedAt ? `Synced at ${cloudConfig.lastSyncedAt}` : 'Click to connect or sync sheet'}</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Pending Admissions */}
        <div 
          onClick={() => setActiveTab('ADMISSIONS')}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs cursor-pointer hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold mb-1">
            <span>Admissions Applications</span>
            <FileSignature className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {admissions.length}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {admissions.filter(a => a.status === 'PENDING').length} pending review
          </div>
        </div>
      </div>

      {/* 3. TAB CONTROLS */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 overflow-x-auto no-print pb-1">
        <button
          onClick={() => setActiveTab('ROSTER')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ROSTER'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students Roster ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ATTENDANCE_TRENDS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ATTENDANCE_TRENDS'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Attendance Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'LOGS'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Sabaq Logs ({hifzLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAMS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'EXAMS'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>Oral Exams & Tajweed ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('TUITION')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'TUITION'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span>Tuition & Kafalat ({tuitionRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'REPORTS'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4 text-[#D4AF37]" />
          <span>Monthly Reports & Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('ADMISSIONS')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ADMISSIONS'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>Admissions Review ({admissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PLEDGES')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'PLEDGES'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Vision 2030 Pledges ({pledges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BACKUP')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'BACKUP'
              ? 'bg-[#0F5132] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Google Sheets & Backup</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}
      {/* ================= TAB 1: STUDENTS ROSTER ================= */}
      {activeTab === 'ROSTER' && (
        <div className="space-y-6">
          <HifzProgressChart students={students} hifzLogs={hifzLogs} />

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden no-print">
            {/* Table Filters & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-gray-200 space-y-3">
              <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
                
                {/* Search Bar with Icon & Clear Button */}
                <div className="relative flex-1 max-w-lg">
                  <input
                    type="text"
                    placeholder="Search student name, ID code (MF-2026-...), guardian phone, surah, track..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0F5132] shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100 transition"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Status Filter Pills (Active / Inactive / All) */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-2xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStatusFilterMode('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      statusFilterMode === 'ALL'
                        ? 'bg-[#0F5132] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>All</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      statusFilterMode === 'ALL' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {students.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilterMode('ACTIVE')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      statusFilterMode === 'ACTIVE'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Active enrolled students (Active & Khatm Track)"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Active</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      statusFilterMode === 'ACTIVE' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilterMode('INACTIVE')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      statusFilterMode === 'INACTIVE'
                        ? 'bg-gray-800 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Inactive students (Graduated & On Leave)"
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    <span>Inactive</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      statusFilterMode === 'INACTIVE' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {inactiveCount}
                    </span>
                  </button>
                </div>

                {/* Additional Level & Detailed Status Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500 font-semibold hidden sm:inline">Level:</span>
                    <select
                      value={filterJuz}
                      onChange={(e) => setFilterJuz(e.target.value as any)}
                      className="text-xs border border-gray-300 rounded-xl px-2.5 py-2 font-bold focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="ALL">All Juz (0-30)</option>
                      <option value="1-10">Juz 1-10</option>
                      <option value="11-20">Juz 11-20</option>
                      <option value="21-30">Juz 21-30 (Khatm)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500 font-semibold hidden sm:inline">Status:</span>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-xs border border-gray-300 rounded-xl px-2.5 py-2 font-bold focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="ALL">Specific: All</option>
                      <option value="ACTIVE">Active Regular</option>
                      <option value="KHATM_TRACK">Khatm Track</option>
                      <option value="REVISION">Revision</option>
                      <option value="GRADUATED">Graduated</option>
                      <option value="ON_LEAVE">On Leave</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Filter Active State & Result Summary Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <span>
                    Showing <strong className="text-gray-900">{filteredStudents.length}</strong> of <strong className="text-gray-900">{students.length}</strong> students
                  </span>
                  {(searchQuery || statusFilterMode !== 'ALL' || filterStatus !== 'ALL' || filterJuz !== 'ALL') && (
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      Filters Active
                    </span>
                  )}
                </div>

                {(searchQuery || statusFilterMode !== 'ALL' || filterStatus !== 'ALL' || filterJuz !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilterMode('ALL');
                      setFilterStatus('ALL');
                      setFilterJuz('ALL');
                    }}
                    className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Student Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Student ID</th>
                    <th className="py-3.5 px-4">Student Full Name</th>
                    <th className="py-3.5 px-4">Hifz Progress</th>
                    <th className="py-3.5 px-4">Daily Attendance</th>
                    <th className="py-3.5 px-4">Guardian Contact</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Actions & Documentation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const isExpanded = expandedStudentId === st.id;
                      return (
                        <React.Fragment key={st.id}>
                          <tr className={`hover:bg-gray-50/80 transition ${isExpanded ? 'bg-emerald-50/40 border-l-4 border-l-[#0F5132]' : ''}`}>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => setExpandedStudentId(isExpanded ? null : st.id)}
                                className="flex items-center gap-1.5 font-mono font-bold text-[#0F5132] hover:text-[#0A3622] group cursor-pointer text-left"
                                title="Click to toggle in-table Student Detail & Progress Curve"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-[#0F5132]" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0F5132]" />
                                )}
                                <span>{st.code}</span>
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudentForDetail(st);
                                  setShowDetailModal(true);
                                }}
                                className="text-left group cursor-pointer"
                                title="Click to open full student detail view"
                              >
                                <div className="font-extrabold text-gray-900 text-sm group-hover:text-[#0F5132] transition">
                                  {st.name}
                                </div>
                                <div className="text-[11px] text-gray-500">
                                  {st.age} yrs • {st.track} • {st.currentSurah}
                                </div>
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-md text-[11px]">
                                  Juz {st.juzLevel} / 30
                                </span>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                <div 
                                  className="bg-[#0F5132] h-1.5 rounded-full" 
                                  style={{ width: `${Math.round((st.juzLevel / 30) * 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-black text-xs ${
                                  st.dailyAttendance >= 95 
                                    ? 'text-emerald-800' 
                                    : st.dailyAttendance >= 85 
                                    ? 'text-amber-800' 
                                    : 'text-red-700'
                                }`}>
                                  {st.dailyAttendance}%
                                </span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      st.dailyAttendance >= 95 
                                        ? 'bg-emerald-600' 
                                        : st.dailyAttendance >= 85 
                                        ? 'bg-amber-500' 
                                        : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${st.dailyAttendance}%` }} 
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-gray-400 block mt-0.5">Halaqah Roll</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-gray-800">{st.guardianName}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-gray-500 text-[11px]">{st.guardianPhone}</span>
                                <a
                                  href={generateWhatsAppUrl(st.guardianPhone, buildDailySabaqMessage(st))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Instant WhatsApp Sabaq Report"
                                  className="text-emerald-600 hover:text-emerald-700 p-0.5 rounded transition hover:bg-emerald-50"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={generateSmsUrl(st.guardianPhone, buildAttendanceAlertMessage(st))}
                                  title="Instant SMS Attendance Alert"
                                  className="text-blue-600 hover:text-blue-700 p-0.5 rounded transition hover:bg-blue-50"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2.5 py-1 text-[10px] font-black rounded-full ${
                                st.status === 'GRADUATED'
                                  ? 'bg-purple-100 text-purple-900'
                                  : st.status === 'KHATM_TRACK'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-[#0F5132]'
                              }`}>
                                {st.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedStudentForDetail(st);
                                    setShowDetailModal(true);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Open student detail view with Hifz progress line graph"
                                >
                                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Detail</span>
                                </button>

                                {/* Edit Student Button */}
                                <button
                                  onClick={() => {
                                    setSelectedStudentForEdit(st);
                                    setShowEditStudentModal(true);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Edit student profile, age, track, attendance, and phone"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => handleOpenLogModal(st)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-emerald-200 transition cursor-pointer"
                                  title="Log today's Sabaq & evaluation"
                                >
                                  <BookOpen className="w-3.5 h-3.5 inline mr-1" />
                                  Log Sabaq
                                </button>

                                <button
                                  onClick={() => handleOpenReportModal(st)}
                                  className="bg-[#0F5132] hover:bg-[#0A3622] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Generate official printable transcript"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Transcript</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudentForReportCard(st);
                                    setShowReportCardModal(true);
                                  }}
                                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Generate official printable Monthly Report Card with Hifz logs and exam records"
                                >
                                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                                  <span>Report Card</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudentForPerformance(st);
                                    setShowPerformanceModal(true);
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="View Monthly Performance Report, 30-day attendance heatmap, and grade GPA"
                                >
                                  <BarChart3 className="w-3.5 h-3.5" />
                                  <span>Monthly</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudentForCert(st);
                                    setShowCertModal(true);
                                  }}
                                  className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 px-2 py-1.5 rounded-lg text-[11px] font-black transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Generate and print official Hifz completion certificate"
                                >
                                  <Award className="w-3.5 h-3.5 text-amber-950" />
                                  <span>Award</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudentForIDCard(st);
                                    setShowIDCardModal(true);
                                  }}
                                  className="bg-slate-800 hover:bg-slate-900 text-white px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Generate Student Photo ID Pass"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                                  <span>Pass</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedStudentForNotifier(st);
                                    setShowNotifierModal(true);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                  title="Send WhatsApp or SMS Progress Alert to Guardian"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Alert</span>
                                </button>

                                <button
                                  onClick={() => setStudentToDelete(st)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                                  title="Remove student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable Row */}
                          {isExpanded && (
                            <tr className="bg-gradient-to-r from-emerald-50/50 via-white to-gray-50/50 border-b-2 border-emerald-200">
                              <td colSpan={7} className="p-4 sm:p-6 animate-fadeIn">
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4">
                                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="font-mono text-xs font-bold text-[#0F5132] bg-emerald-100 px-2.5 py-1 rounded-lg">
                                        {st.code}
                                      </span>
                                      <h4 className="text-sm sm:text-base font-black text-gray-900">
                                        Student Detail & Hifz Velocity: {st.name}
                                      </h4>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedStudentForEdit(st);
                                          setShowEditStudentModal(true);
                                        }}
                                        className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition"
                                        title="Quick Edit Student Details"
                                      >
                                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Edit Dossier</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedStudentForDetail(st);
                                          setShowDetailModal(true);
                                        }}
                                        className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Full Dossier</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedStudentId(null)}
                                        className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                      >
                                        <ChevronUp className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <StudentDetailChart student={st} hifzLogs={hifzLogs} height={220} showCardWrapper={false} />
                                  <AttendanceHeatmap student={st} />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: VISUAL ATTENDANCE TRENDS DASHBOARD ================= */}
      {activeTab === 'ATTENDANCE_TRENDS' && (
        <AttendanceTrendsDashboard
          students={students}
          onOpenNotifierModal={(st) => {
            setSelectedStudentForNotifier(st);
            setShowNotifierModal(true);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* ================= TAB 3: SABAQ LOGS ================= */}
      {activeTab === 'LOGS' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden no-print">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Daily Recitation & Examination History
              </h3>
              <p className="text-xs text-gray-500">Chronological ledger of Sabaq, Sabqi, and Manzil evaluations</p>
            </div>
            <button
              onClick={() => handleOpenLogModal()}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Record New Sabaq Log</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Sabaq (New Lesson)</th>
                  <th className="py-3 px-4">Sabqi (Recent)</th>
                  <th className="py-3 px-4">Manzil (Cycle)</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Mu'allim Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {hifzLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No logs recorded yet. Click "Record New Sabaq Log" to begin.
                    </td>
                  </tr>
                ) : (
                  hifzLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                        {log.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900">{log.studentName}</div>
                        <div className="text-[10px] font-mono text-[#0F5132]">{log.studentCode}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {log.sabaqRange}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold text-[11px]">
                          Juz {log.sabqiJuz}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold text-[11px]">
                          Juz {log.manzilJuz}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                          log.grade === 'MUMTAZ'
                            ? 'bg-emerald-100 text-emerald-900'
                            : log.grade === 'JAYYID_JIDDAN'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {log.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 italic max-w-xs truncate">
                        "{log.notes || 'Routine revision successfully cleared.'}"
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORAL EXAMS ================= */}
      {activeTab === 'EXAMS' && (
        <div className="space-y-6 no-print">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  Standardized Oral Examination Ledger
                </h3>
                <span className="bg-emerald-100 text-[#0F5132] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Oral Rubric
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Evaluates Hifz Memory (40 pts), Makharij (30 pts), and Ahkam at-Tajweed (30 pts)
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedStudentForExam(students[0] || null);
                setShowExamModal(true);
              }}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white px-4 py-2.5 rounded-xl text-xs font-black transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Evaluate Oral Exam</span>
            </button>
          </div>

          {/* Exam Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Oral Examinations</span>
              <div className="text-2xl font-black text-[#0F5132] mt-1">{exams.length} Evaluated</div>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Conducted by Board of Examiners</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Mumtaz (Distinction) Honors</span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {exams.filter(e => e.grade === 'MUMTAZ').length} Candidates
              </div>
              <span className="text-[10px] text-amber-700 block mt-0.5">Scored 90 - 100 on formal rubric</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">Cohort Average Score</span>
              <div className="text-2xl font-black text-sky-900 mt-1">
                {Math.round(exams.reduce((acc, e) => acc + e.totalScore, 0) / (exams.length || 1))} / 100
              </div>
              <span className="text-[10px] text-sky-700 block mt-0.5">Across Chiro halaqat cohorts</span>
            </div>
          </div>

          {/* Ledger */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#0F5132] text-white uppercase text-[10px] font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Scope Tested</th>
                    <th className="py-3 px-4 text-center">Hifz (/40)</th>
                    <th className="py-3 px-4 text-center">Makharij (/30)</th>
                    <th className="py-3 px-4 text-center">Tajweed (/30)</th>
                    <th className="py-3 px-4 text-center">Total / Grade</th>
                    <th className="py-3 px-4">Examiner</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {exams.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400">
                        No oral exams recorded yet.
                      </td>
                    </tr>
                  ) : (
                    exams.map((ex) => (
                      <tr key={ex.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3.5 px-4 font-mono">{ex.examDate}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-gray-900">{ex.studentName}</div>
                          <span className="font-mono text-[10px] text-gray-400">{ex.studentCode}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">{ex.juzTested}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-amber-900">{ex.hifzScore}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#0F5132]">{ex.makharijScore}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-sky-800">{ex.tajweedScore}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            ex.grade === 'MUMTAZ' 
                              ? 'bg-emerald-100 text-[#0F5132]' 
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {ex.totalScore} ({ex.grade})
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700">{ex.examinerName}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedStudentForExam(students.find(s => s.id === ex.studentId) || null);
                              setShowExamModal(true);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-[#0F5132]" />
                            <span>Slip</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: TUITION ================= */}
      {activeTab === 'TUITION' && (
        <div className="space-y-6 no-print">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  Tuition Ledger & Kafalat al-Yateem Orphan Sponsorships
                </h3>
                <span className="bg-purple-100 text-purple-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Treasury
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Monthly fee collection tracking, orphan endowments, and instant receipt generation
              </p>
            </div>

            <button
              onClick={() => setShowTuitionModal(true)}
              className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2.5 rounded-xl text-xs font-black transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-purple-200" />
              <span>Manage Fees & Receipts</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Total Collected</span>
              <div className="text-2xl font-black text-[#0F5132] mt-1">
                {tuitionRecords.filter(r => r.status === 'PAID' || r.status === 'SPONSORED').reduce((a,b) => a + b.amountETB, 0).toLocaleString()} ETB
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending Fees</span>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {tuitionRecords.filter(r => r.status === 'PENDING' || r.status === 'OVERDUE').reduce((a,b) => a + b.amountETB, 0).toLocaleString()} ETB
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Orphan Endowments (Kafalat)</span>
              <div className="text-2xl font-black text-purple-900 mt-1">
                {tuitionRecords.filter(r => r.status === 'SPONSORED').length} Students
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-700 uppercase block">Active Rate</span>
              <div className="text-2xl font-black text-gray-900 mt-1">800 ETB / Mo</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-[#0F5132] text-white uppercase text-[10px] font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Guardian Contact</th>
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Method / Sponsor</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tuitionRecords.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div>{t.studentName}</div>
                        <span className="font-mono text-[10px] text-gray-400">{t.studentCode}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div>{t.guardianName}</div>
                        <span className="font-mono text-[10px] text-gray-500">{t.guardianPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">{t.month}</td>
                      <td className="py-3.5 px-4 font-black text-[#0F5132]">{t.amountETB} ETB</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          t.status === 'PAID' ? 'bg-emerald-100 text-[#0F5132]' :
                          t.status === 'SPONSORED' ? 'bg-purple-100 text-purple-900' :
                          t.status === 'PENDING' ? 'bg-amber-100 text-amber-900' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {t.sponsorName ? (
                          <span className="text-purple-900 font-bold">{t.sponsorName}</span>
                        ) : t.paymentMethod ? (
                          <span className="font-mono font-bold text-gray-800">{t.paymentMethod}</span>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setShowTuitionModal(true)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          {t.receiptNumber || 'View / Print'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: REPORTS ================= */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          {/* Sub-view Switcher Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Reports View:</span>
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setReportsViewMode('PERFORMANCE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                    reportsViewMode === 'PERFORMANCE'
                      ? 'bg-[#0F5132] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Student Performance & 30-Day Heatmap</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportsViewMode('COHORT')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                    reportsViewMode === 'COHORT'
                      ? 'bg-[#0F5132] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Cohort Comprehensive Audit</span>
                </button>
              </div>
            </div>

            <span className="text-[11px] text-gray-500 font-medium">
              High-resolution printable PDF • Google Drive & WhatsApp Shareable
            </span>
          </div>

          {reportsViewMode === 'PERFORMANCE' ? (
            <MonthlyPerformanceReport
              students={students}
              hifzLogs={hifzLogs}
              onOpenCertModal={(st) => {
                setSelectedStudentForCert(st);
                setShowCertModal(true);
              }}
            />
          ) : (
            <MonthlyProgressReport
              students={students}
              hifzLogs={hifzLogs}
              onSelectStudent={(st) => {
                setSelectedStudentForDetail(st);
                setShowDetailModal(true);
              }}
              onOpenReportModal={(st) => handleOpenReportModal(st)}
              onOpenCertModal={(st) => {
                setSelectedStudentForCert(st);
                setShowCertModal(true);
              }}
            />
          )}
        </div>
      )}

      {/* ================= TAB 6: ADMISSIONS ================= */}
      {activeTab === 'ADMISSIONS' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden no-print">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-base font-extrabold text-gray-900">
              Student Admission Applications (2018 / 2019 E.C.)
            </h3>
            <p className="text-xs text-gray-500">
              Applications submitted online by parents and candidates in Chiro
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Guardian & Phone</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Prior Memorization</th>
                  <th className="py-3 px-4">Fee Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  admissions.map((adm) => (
                    <tr key={adm.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{adm.submissionDate}</td>
                      <td className="py-3 px-4 font-extrabold text-gray-900">{adm.fullName}</td>
                      <td className="py-3 px-4">
                        <div>{adm.guardianName}</div>
                        <div className="font-mono text-gray-500 text-[11px]">{adm.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#0F5132]">{adm.track}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">
                          Juz {adm.priorJuz}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{adm.paymentChannel}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                          adm.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {adm.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {adm.status === 'PENDING' ? (
                          <button
                            onClick={() => onApproveAdmission(adm.id)}
                            className="bg-[#0F5132] hover:bg-[#0A3622] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Enroll</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs">Enrolled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 7: PLEDGES ================= */}
      {activeTab === 'PLEDGES' && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden no-print">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Vision 2030 Capital Campaign Ledger
              </h3>
              <p className="text-xs text-gray-500">Record of community sponsorships, bank transfers, and Telebirr donations</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 uppercase font-bold block">Target</span>
              <span className="text-sm font-black text-[#0F5132]">ETB 10,000,000</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Bank / Channel</th>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4 text-right">Amount (ETB)</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pledges.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono">{p.date}</td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">{p.donorName}</td>
                    <td className="py-3 px-4 text-gray-500">{p.phoneOrEmail}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">{p.tier}</td>
                    <td className="py-3 px-4">{p.channel}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{p.referenceNumber || 'N/A'}</td>
                    <td className="py-3 px-4 text-right font-black text-sm text-[#0F5132]">
                      ETB {p.amountETB.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedPledgeForReceipt(p);
                          setShowReceiptModal(true);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 mx-auto cursor-pointer"
                        title="Print Official Donation Receipt"
                      >
                        <Printer className="w-3 h-3 text-[#D4AF37]" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 8: BACKUP, CLOUD & GOOGLE SHEETS ================= */}
      {activeTab === 'BACKUP' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          {/* Box 1: Firebase Firestore Free Tier Cloud Storage */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-600" />
                <span>Cloud Storage (Free Tier)</span>
              </h4>
              <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                Spark Plan
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Real-time Firestore cloud database configured for Markazul Furqan. Operates 100% on Firebase free quota (1 GB storage, 50k reads/day) without requiring paid API keys.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#0F5132]">Cloud Status:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {cloudSyncStatus === 'SYNCED' ? 'Live Cloud Synced' : cloudSyncStatus === 'SYNCING' ? 'Uploading...' : 'Offline Storage'}
                </span>
              </div>
              <div className="text-[11px] text-gray-600 font-mono break-all">
                DB ID: ai-studio-alfurqanacademyh-679139b6-20b8-4372-b841-dec5efc2e8f0
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {onSeedCloudData && (
                <button
                  onClick={onSeedCloudData}
                  className="w-full bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow cursor-pointer"
                  title="Upload all student rosters, evaluations, exams, tuition, and pledges into Firestore Cloud Storage"
                >
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Upload Local Records to Cloud Database</span>
                </button>
              )}

              {onOpenPublishGuide && (
                <button
                  onClick={onOpenPublishGuide}
                  className="w-full bg-emerald-100 hover:bg-emerald-200 text-[#0F5132] text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-emerald-300 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0F5132]" />
                  <span>Free-Tier Publishing & Hosting Guide</span>
                </button>
              )}
            </div>
          </div>

          {/* Box 2: Google Sheets Live Integration */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Google Sheets Synchronization</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Connect your Google account to sync all students, Sabaq records, oral exam rubrics, tuition ledgers, and pledges directly into Google Sheets with dynamic formulas.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#0F5132]">Connected Google Sheet:</span>
                {cloudConfig.connectedSpreadsheetId ? (
                  <span className="text-emerald-800 font-bold bg-emerald-200/60 px-2 py-0.5 rounded text-[10px]">
                    Active
                  </span>
                ) : (
                  <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                    Ready to Connect
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-gray-700 block truncate">
                {cloudConfig.connectedSpreadsheetTitle || 'No spreadsheet linked yet.'}
              </span>
              {cloudConfig.connectedSpreadsheetUrl && (
                <a
                  href={cloudConfig.connectedSpreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Open Live Spreadsheet in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={onOpenGoogleSheetsSync || onOpenCloudConfig}
              className="w-full bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>Manage Google Sheets Synchronization</span>
            </button>
          </div>

          {/* Box 3: Export / Import & Disaster Recovery */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0F5132]" />
              <span>Offline Data Backup & Archives</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Export all student rosters and Hifz evaluations to Excel/CSV or download a complete JSON backup archive for local disaster recovery.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onExportCSV}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Students & Logs to CSV (Excel)</span>
              </button>

              <button
                onClick={onExportJSON}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 border border-gray-300 cursor-pointer"
              >
                <Download className="w-4 h-4 text-gray-600" />
                <span>Download JSON Backup Archive</span>
              </button>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onImportJSON(e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-2 border border-dashed border-gray-300 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span>Restore from JSON File</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2 rounded-xl transition border border-red-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset to Demonstration Seed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      <HifzLogModal
        isOpen={showHifzLogModal}
        onClose={() => {
          setShowHifzLogModal(false);
          setSelectedStudentForLog(null);
        }}
        students={students}
        preselectedStudent={selectedStudentForLog}
        onSubmit={onAddHifzLog}
        currentMuallimName={currentUser?.name || "Ustadh Ziyad Abdullahi"}
      />

      <AddStudentModal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        onAdd={onAddStudent}
        nextStudentCount={students.length}
      />

      <StudentReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setSelectedStudentForReport(null);
        }}
        student={selectedStudentForReport}
        logs={hifzLogs}
      />

      <CertificateGenerator
        isOpen={showCertModal}
        onClose={() => {
          setShowCertModal(false);
          setSelectedStudentForCert(null);
        }}
        student={selectedStudentForCert}
        students={students}
        onSelectStudent={(st) => setSelectedStudentForCert(st)}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setSelectedPledgeForReceipt(null);
        }}
        pledge={selectedPledgeForReceipt}
      />

      <StudentDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedStudentForDetail(null);
        }}
        student={selectedStudentForDetail}
        hifzLogs={hifzLogs}
        onOpenLogModal={(st) => handleOpenLogModal(st)}
        onOpenReportModal={(st) => handleOpenReportModal(st)}
        onOpenCertModal={(st) => {
          setSelectedStudentForCert(st);
          setShowCertModal(true);
        }}
        onOpenAttendanceModal={() => setShowAttendanceModal(true)}
        onOpenNotifierModal={(st) => {
          setSelectedStudentForNotifier(st);
          setShowNotifierModal(true);
        }}
        onOpenIDCardModal={(st) => {
          setSelectedStudentForIDCard(st);
          setShowIDCardModal(true);
        }}
        onOpenEditModal={(st) => {
          setSelectedStudentForEdit(st);
          setShowEditStudentModal(true);
        }}
      />

      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        students={students}
        onSaveAttendance={async (updated) => {
          if (onUpdateAttendance) {
            await onUpdateAttendance(updated);
          }
          onShowToast?.('Daily attendance successfully recorded and recalculated!');
        }}
      />

      <GuardianNotifierModal
        isOpen={showNotifierModal}
        onClose={() => {
          setShowNotifierModal(false);
          setSelectedStudentForNotifier(null);
        }}
        students={students}
        initialStudent={selectedStudentForNotifier}
        hifzLogs={hifzLogs}
      />

      <StudentIDCardModal
        isOpen={showIDCardModal}
        onClose={() => {
          setShowIDCardModal(false);
          setSelectedStudentForIDCard(null);
        }}
        students={students}
        initialStudent={selectedStudentForIDCard}
      />

      <ExamRubricModal
        isOpen={showExamModal}
        onClose={() => {
          setShowExamModal(false);
          setSelectedStudentForExam(null);
        }}
        students={students}
        initialStudent={selectedStudentForExam}
        exams={exams}
        onSaveExam={async (exam) => {
          if (onSaveExam) {
            await onSaveExam(exam);
          }
          onShowToast?.(`Examination recorded for ${exam.studentName} with score ${exam.totalScore}/100!`);
        }}
      />

      <TuitionLedgerModal
        isOpen={showTuitionModal}
        onClose={() => setShowTuitionModal(false)}
        students={students}
        tuitionRecords={tuitionRecords}
        onSaveTuition={async (rec) => {
          if (onSaveTuition) {
            await onSaveTuition(rec);
          }
          onShowToast?.(`Tuition fee updated for ${rec.studentName} (${rec.status})!`);
        }}
      />

      {/* Admin / Owner Student Edit Modal */}
      <EditStudentModal
        isOpen={showEditStudentModal}
        onClose={() => {
          setShowEditStudentModal(false);
          setSelectedStudentForEdit(null);
        }}
        student={selectedStudentForEdit}
        onSaveStudent={async (updated) => {
          if (onUpdateStudent) {
            await onUpdateStudent(updated);
          }
          setShowEditStudentModal(false);
          setSelectedStudentForEdit(null);
          onShowToast?.(`Updated student ${updated.name} (${updated.code})!`);
        }}
      />

      {/* Admin / Owner Institution Settings Modal */}
      {institutionSettings && onSaveSettings && (
        <AdminSettingsModal
          isOpen={showAdminSettingsModal}
          onClose={() => setShowAdminSettingsModal(false)}
          settings={institutionSettings}
          onSaveSettings={async (newSettings) => {
            await onSaveSettings(newSettings);
            onShowToast?.('Institution settings and contact channels updated!');
          }}
        />
      )}

      {/* Custom In-App Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1">Remove Student?</h4>
            <p className="text-xs text-gray-600 mb-5">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> ({studentToDelete.code}) from the active roster?
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => setStudentToDelete(null)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom In-App Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1">Reset Demo Data?</h4>
            <p className="text-xs text-gray-600 mb-5">
              This will restore all student records, Hifz logs, admissions, and Vision 2030 pledges back to the default demonstration dataset.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition shadow cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Student Monthly Performance Report Modal */}
      {showPerformanceModal && selectedStudentForPerformance && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-gray-100 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 relative shadow-2xl">
            <button
              onClick={() => {
                setShowPerformanceModal(false);
                setSelectedStudentForPerformance(null);
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-md cursor-pointer hover:bg-gray-50 transition"
              title="Close Performance Report"
            >
              <X className="w-5 h-5" />
            </button>
            <MonthlyPerformanceReport
              students={students}
              hifzLogs={hifzLogs}
              initialStudentId={selectedStudentForPerformance.id}
              onClose={() => {
                setShowPerformanceModal(false);
                setSelectedStudentForPerformance(null);
              }}
              onOpenCertModal={(st) => {
                setSelectedStudentForCert(st);
                setShowCertModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Official Monthly Report Card Generator Modal */}
      {showReportCardModal && (
        <MonthlyReportCardModal
          isOpen={showReportCardModal}
          onClose={() => {
            setShowReportCardModal(false);
            setSelectedStudentForReportCard(null);
          }}
          students={students}
          initialStudentId={selectedStudentForReportCard?.id}
          hifzLogs={hifzLogs}
          exams={exams}
          institutionSettings={institutionSettings}
          onShowToast={onShowToast}
        />
      )}

      {/* Share & Google Drive Modal for Student Ledger CSV */}
      <ShareDocumentModal
        isOpen={showShareCsvModal}
        onClose={() => setShowShareCsvModal(false)}
        title="Student Ledger & Academic Database"
        filename={`Markazul_Furqan_Ledger_${new Date().toISOString().split('T')[0]}.csv`}
        csvContent={csvDataString}
        summaryText={`Markazul Furqan Student Academic Ledger CSV export with ${students.length} enrolled students across 5 Chiro halaqat.`}
        onShowToast={onShowToast}
      />

    </div>
  );
};
