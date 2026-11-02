import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Student, 
  HifzLog, 
  ExamRecord, 
  TuitionRecord, 
  AdmissionApplication, 
  DonationPledge, 
  CloudConfig, 
  UserSession,
  InstitutionSettings
} from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_HIFZ_LOGS, 
  INITIAL_EXAMS, 
  INITIAL_TUITION, 
  INITIAL_ADMISSIONS, 
  INITIAL_PLEDGES,
  INITIAL_SETTINGS
} from './data/initialData';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken,
  testFirestoreConnection,
  subscribeToCollection,
  saveDocumentToCloud,
  deleteDocumentFromCloud,
  subscribeSettings,
  saveSettingsToCloud,
  seedAllDataToCloud
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { PublicHero } from './components/PublicHero';
import { AcademicPortal } from './components/portal/AcademicPortal';
import { GoogleSheetsSyncModal } from './components/portal/GoogleSheetsSyncModal';
import { PublicAdmissionsModal } from './components/PublicAdmissionsModal';
import { PublicDonationModal } from './components/PublicDonationModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AdminSettingsModal } from './components/portal/AdminSettingsModal';
import { FreeTierPublishModal } from './components/portal/FreeTierPublishModal';
import { Toast } from './components/Toast';
import { downloadCsv } from './utils/shareUtils';

export default function App() {
  // Local storage keys
  const STORAGE_PREFIX = 'mf_chiro_';

  // Persistence helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [students, setStudents] = useState<Student[]>(() => loadStored('students', INITIAL_STUDENTS));
  const [hifzLogs, setHifzLogs] = useState<HifzLog[]>(() => loadStored('logs', INITIAL_HIFZ_LOGS));
  const [exams, setExams] = useState<ExamRecord[]>(() => loadStored('exams', INITIAL_EXAMS));
  const [tuitionRecords, setTuitionRecords] = useState<TuitionRecord[]>(() => loadStored('tuition', INITIAL_TUITION));
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => loadStored('admissions', INITIAL_ADMISSIONS));
  const [pledges, setPledges] = useState<DonationPledge[]>(() => loadStored('pledges', INITIAL_PLEDGES));
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(() => loadStored('cloud', {}));
  const [institutionSettings, setInstitutionSettings] = useState<InstitutionSettings>(() => loadStored('settings', INITIAL_SETTINGS));

  // App view state
  const [currentView, setCurrentView] = useState<'PUBLIC' | 'PORTAL'>('PUBLIC');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Cloud & Free Tier Status
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'SYNCED' | 'SYNCING' | 'OFFLINE'>('SYNCED');

  // Modals
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showAdmissionsModal, setShowAdmissionsModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAdminSettingsModal, setShowAdminSettingsModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [receiptPledge, setReceiptPledge] = useState<DonationPledge | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(students));
      localStorage.setItem(STORAGE_PREFIX + 'logs', JSON.stringify(hifzLogs));
      localStorage.setItem(STORAGE_PREFIX + 'exams', JSON.stringify(exams));
      localStorage.setItem(STORAGE_PREFIX + 'tuition', JSON.stringify(tuitionRecords));
      localStorage.setItem(STORAGE_PREFIX + 'admissions', JSON.stringify(admissions));
      localStorage.setItem(STORAGE_PREFIX + 'pledges', JSON.stringify(pledges));
      localStorage.setItem(STORAGE_PREFIX + 'cloud', JSON.stringify(cloudConfig));
      localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(institutionSettings));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [students, hifzLogs, exams, tuitionRecords, admissions, pledges, cloudConfig, institutionSettings]);

  // Test connection to Firestore on boot
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // Initialize Real-Time Firebase Firestore Subscriptions (Free Spark Tier)
  useEffect(() => {
    const unsubStudents = subscribeToCollection<Student>('students', (cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents(cloudStudents);
        setCloudSyncStatus('SYNCED');
      }
    });

    const unsubLogs = subscribeToCollection<HifzLog>('hifz_logs', (cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setHifzLogs(cloudLogs);
      }
    });

    const unsubExams = subscribeToCollection<ExamRecord>('exams', (cloudExams) => {
      if (cloudExams && cloudExams.length > 0) {
        setExams(cloudExams);
      }
    });

    const unsubTuition = subscribeToCollection<TuitionRecord>('tuition', (cloudTuition) => {
      if (cloudTuition && cloudTuition.length > 0) {
        setTuitionRecords(cloudTuition);
      }
    });

    const unsubAdmissions = subscribeToCollection<AdmissionApplication>('admissions', (cloudAdmissions) => {
      if (cloudAdmissions && cloudAdmissions.length > 0) {
        setAdmissions(cloudAdmissions);
      }
    });

    const unsubPledges = subscribeToCollection<DonationPledge>('pledges', (cloudPledges) => {
      if (cloudPledges && cloudPledges.length > 0) {
        setPledges(cloudPledges);
      }
    });

    const unsubSettings = subscribeSettings((cloudSettings) => {
      if (cloudSettings && cloudSettings.nameEn) {
        setInstitutionSettings(cloudSettings);
      }
    });

    return () => {
      unsubStudents();
      unsubLogs();
      unsubExams();
      unsubTuition();
      unsubAdmissions();
      unsubPledges();
      unsubSettings();
    };
  }, []);

  // Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        showToast(`Signed in as ${res.user.displayName || res.user.email}!`);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Google sign-in was not completed');
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    showToast('Signed out of Google account');
  };

  // Seed local records to cloud storage (one-click migration for free tier)
  const handleSeedCloudData = async () => {
    setCloudSyncStatus('SYNCING');
    showToast('Uploading records to Free-Tier Cloud Storage...');
    try {
      const res = await seedAllDataToCloud({
        students,
        hifzLogs,
        exams,
        tuition: tuitionRecords,
        admissions,
        pledges,
        settings: institutionSettings
      });
      setCloudSyncStatus('SYNCED');
      showToast(`Successfully synced ${res.totalUploaded} records to Firestore Cloud Storage!`);
    } catch (err: any) {
      console.error('Cloud upload error:', err);
      setCloudSyncStatus('OFFLINE');
      showToast('Cloud sync paused (using offline local storage)');
    }
  };

  // CRUD Handlers with Cloud Storage Persistence
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'dailyAttendance'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `st-${Date.now()}`,
      dailyAttendance: 100
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast(`Enrolled student ${newStudent.name} (${newStudent.code})!`);

    // Sync to Firestore Cloud
    try {
      await saveDocumentToCloud('students', newStudent);
    } catch (err) {
      console.warn('Offline mode: student saved locally.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Student removed from ledger');

    // Remove from Firestore Cloud
    try {
      await deleteDocumentFromCloud('students', id);
    } catch (err) {
      console.warn('Offline mode: deletion applied locally.');
    }
  };

  const handleUpdateStudent = async (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    showToast(`Updated student ${updated.name} (${updated.code})!`);

    try {
      await saveDocumentToCloud('students', updated);
    } catch (err) {
      console.warn('Offline mode: student updated locally.');
    }
  };

  const handleSaveSettings = async (newSettings: InstitutionSettings) => {
    setInstitutionSettings(newSettings);
    showToast('Institutional settings, contacts, and channels updated!');

    try {
      await saveSettingsToCloud(newSettings);
    } catch (err) {
      console.warn('Offline mode: settings updated locally.');
    }
  };

  const handleAddHifzLog = async (logData: Omit<HifzLog, 'id' | 'date'>) => {
    const newLog: HifzLog = {
      ...logData,
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setHifzLogs(prev => [newLog, ...prev]);

    // Update student currentSurah
    setStudents(prev => prev.map(s => {
      if (s.id === logData.studentId) {
        return { ...s, currentSurah: logData.sabaqRange };
      }
      return s;
    }));

    showToast(`Logged Sabaq for ${logData.studentName} (${logData.grade})!`);

    try {
      await saveDocumentToCloud('hifz_logs', newLog);
    } catch (err) {
      console.warn('Offline mode: log saved locally.');
    }
  };

  const handleUpdateAttendance = async (updated: Student[]) => {
    setStudents(updated);
    for (const st of updated) {
      saveDocumentToCloud('students', st).catch(() => {});
    }
  };

  const handleSaveExam = async (exam: ExamRecord) => {
    setExams(prev => [exam, ...prev.filter(e => e.id !== exam.id)]);
    showToast(`Saved oral exam evaluation for ${exam.studentName}!`);

    try {
      await saveDocumentToCloud('exams', exam);
    } catch (err) {
      console.warn('Offline mode: exam saved locally.');
    }
  };

  const handleSaveTuition = async (record: TuitionRecord) => {
    setTuitionRecords(prev => [record, ...prev.filter(t => t.id !== record.id)]);
    showToast(`Updated tuition record for ${record.studentName} (${record.month})!`);

    try {
      await saveDocumentToCloud('tuition', record);
    } catch (err) {
      console.warn('Offline mode: tuition saved locally.');
    }
  };

  const handleApproveAdmission = async (id: string) => {
    const app = admissions.find(a => a.id === id);
    if (!app) return;

    // Create student
    const newStudent: Student = {
      id: `st-${Date.now()}`,
      code: `MF-2026-${String(students.length + 1).padStart(3, '0')}`,
      name: app.fullName,
      age: app.age,
      gender: app.gender,
      track: app.track,
      currentSurah: 'Surah Al-Baqarah',
      juzLevel: app.priorJuz,
      dailyAttendance: 100,
      guardianName: app.guardianName,
      guardianPhone: app.phone,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      halaqahGroup: app.gender === 'FEMALE' ? 'Halaqah Aisha bint Abi Bakr' : 'Halaqah Ubayy ibn Kaab'
    };

    setStudents(prev => [newStudent, ...prev]);
    const updatedAdm: AdmissionApplication = { ...app, status: 'APPROVED' };
    setAdmissions(prev => prev.map(a => a.id === id ? updatedAdm : a));
    showToast(`Approved & enrolled ${app.fullName} as ${newStudent.code}!`);

    try {
      await saveDocumentToCloud('students', newStudent);
      await saveDocumentToCloud('admissions', updatedAdm);
    } catch (err) {
      console.warn('Offline mode: admission approved locally.');
    }
  };

  const handlePublicAdmissionSubmit = async (appData: Omit<AdmissionApplication, 'id' | 'submissionDate' | 'status'>) => {
    const newAdm: AdmissionApplication = {
      ...appData,
      id: `adm-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };
    setAdmissions(prev => [newAdm, ...prev]);
    showToast('Admission application received! Our registrar will contact the guardian.');

    try {
      await saveDocumentToCloud('admissions', newAdm);
    } catch (err) {
      console.warn('Offline mode: application saved locally.');
    }
  };

  const handlePublicDonationSubmit = async (pledgeData: Omit<DonationPledge, 'id' | 'date'>) => {
    const newPledge: DonationPledge = {
      ...pledgeData,
      id: `pl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setPledges(prev => [newPledge, ...prev]);
    showToast(`Recorded pledge of ETB ${pledgeData.amountETB.toLocaleString()}!`);

    try {
      await saveDocumentToCloud('pledges', newPledge);
    } catch (err) {
      console.warn('Offline mode: pledge saved locally.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Age', 'Gender', 'Track', 'Current Surah', 'Juz Level', 'Attendance %', 'Guardian Name', 'Guardian Phone', 'Status', 'Halaqah Group'];
    const rows = students.map(s => [
      `"${s.code}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.age,
      s.gender,
      `"${s.track.replace(/"/g, '""')}"`,
      `"${s.currentSurah.replace(/"/g, '""')}"`,
      s.juzLevel,
      `"${s.dailyAttendance}%"`,
      `"${s.guardianName.replace(/"/g, '""')}"`,
      `"${s.guardianPhone}"`,
      s.status,
      `"${s.halaqahGroup.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    downloadCsv(csvContent, `Markazul_Furqan_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Downloaded students roster CSV');
  };

  // JSON Export / Import
  const handleExportJSON = () => {
    const archive = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      institution: 'Markazul Furqan (Chiro, Ethiopia)',
      tier: 'Free Tier with Cloud Storage',
      students,
      hifzLogs,
      exams,
      tuitionRecords,
      admissions,
      pledges,
      cloudConfig,
      settings: institutionSettings
    };
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Markazul_Furqan_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Complete JSON backup downloaded');
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.students) setStudents(json.students);
        if (json.hifzLogs) setHifzLogs(json.hifzLogs);
        if (json.exams) setExams(json.exams);
        if (json.tuitionRecords) setTuitionRecords(json.tuitionRecords);
        if (json.admissions) setAdmissions(json.admissions);
        if (json.pledges) setPledges(json.pledges);
        if (json.settings) setInstitutionSettings(json.settings);
        showToast('Successfully restored records from backup!');
      } catch (err) {
        showToast('Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setHifzLogs(INITIAL_HIFZ_LOGS);
    setExams(INITIAL_EXAMS);
    setTuitionRecords(INITIAL_TUITION);
    setAdmissions(INITIAL_ADMISSIONS);
    setPledges(INITIAL_PLEDGES);
    showToast('Demonstration data restored');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans flex flex-col selection:bg-[#D4AF37]/30 selection:text-gray-950">
      
      {/* Navbar with Cloud Status & Publishing Guide Link */}
      <Navbar
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        cloudConfig={cloudConfig}
        onOpenGoogleSheets={() => setShowSheetsModal(true)}
        currentView={currentView}
        onToggleView={(v) => setCurrentView(v)}
        onOpenAdmissions={() => setShowAdmissionsModal(true)}
        onOpenDonate={() => setShowDonationModal(true)}
        institutionSettings={institutionSettings}
        onOpenAdminSettings={() => setShowAdminSettingsModal(true)}
        onOpenPublishGuide={() => setShowPublishModal(true)}
        cloudSyncStatus={cloudSyncStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'PORTAL' ? (
          <AcademicPortal
            students={students}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
            hifzLogs={hifzLogs}
            onAddHifzLog={handleAddHifzLog}
            admissions={admissions}
            onApproveAdmission={handleApproveAdmission}
            pledges={pledges}
            cloudConfig={cloudConfig}
            onOpenCloudConfig={() => setShowSheetsModal(true)}
            onExitPortal={() => setCurrentView('PUBLIC')}
            currentUser={currentUser ? {
              uid: currentUser.uid,
              name: currentUser.displayName || 'Faculty Muallim',
              email: currentUser.email || 'faculty@markazulfurqan.edu.et',
              role: 'Muallim Faculty',
              photoURL: currentUser.photoURL || undefined
            } : null}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            onResetData={handleResetData}
            onShowToast={showToast}
            onUpdateAttendance={handleUpdateAttendance}
            exams={exams}
            onSaveExam={handleSaveExam}
            tuitionRecords={tuitionRecords}
            onSaveTuition={handleSaveTuition}
            onOpenGoogleSheetsSync={() => setShowSheetsModal(true)}
            institutionSettings={institutionSettings}
            onSaveSettings={handleSaveSettings}
            isFirestoreConnected={isFirestoreConnected}
            onSeedCloudData={handleSeedCloudData}
            cloudSyncStatus={cloudSyncStatus}
            onOpenPublishGuide={() => setShowPublishModal(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <PublicHero
              students={students}
              pledges={pledges}
              onOpenPortal={() => setCurrentView('PORTAL')}
              onOpenAdmissions={() => setShowAdmissionsModal(true)}
              onOpenDonate={() => setShowDonationModal(true)}
              onOpenGoogleSheets={() => setShowSheetsModal(true)}
              hasGoogleSheet={Boolean(cloudConfig.connectedSpreadsheetId)}
              onOpenPublishGuide={() => setShowPublishModal(true)}
            />
          </div>
        )}
      </main>

      {/* Google Sheets Sync & Data Analysis Modal */}
      <GoogleSheetsSyncModal
        isOpen={showSheetsModal}
        onClose={() => setShowSheetsModal(false)}
        cloudConfig={cloudConfig}
        onUpdateCloudConfig={(c) => setCloudConfig(c)}
        data={{
          students,
          hifzLogs,
          exams,
          tuition: tuitionRecords,
          admissions,
          pledges
        }}
        onShowToast={showToast}
      />

      {/* Free Tier & Standalone Publishing Guide Modal */}
      <FreeTierPublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onShowToast={showToast}
      />

      {/* Public Admissions Application Modal */}
      <PublicAdmissionsModal
        isOpen={showAdmissionsModal}
        onClose={() => setShowAdmissionsModal(false)}
        onSubmit={handlePublicAdmissionSubmit}
      />

      {/* Public Donation Pledge Modal */}
      <PublicDonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSubmit={handlePublicDonationSubmit}
        onOpenReceipt={(p) => setReceiptPledge(p)}
      />

      {/* Donation Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(receiptPledge)}
        onClose={() => setReceiptPledge(null)}
        pledge={receiptPledge}
      />

      {/* Admin / Owner Institutional Settings Modal */}
      <AdminSettingsModal
        isOpen={showAdminSettingsModal}
        onClose={() => setShowAdminSettingsModal(false)}
        settings={institutionSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}
