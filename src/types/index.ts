export type StudentStatus = 'ACTIVE' | 'KHATM_TRACK' | 'GRADUATED' | 'REVISION' | 'ON_LEAVE';

export interface Student {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  track: string; // e.g. "Full-time Hifz", "Chiro Halaqah A", "Evening Tajweed"
  currentSurah: string;
  juzLevel: number; // 0 to 30
  dailyAttendance: number; // 0 to 100%
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  enrollmentDate: string;
  status: StudentStatus;
  bloodGroup?: string;
  halaqahGroup: string;
  monthlyAttendanceHistory?: { [dateStr: string]: boolean };
}

export type HifzGrade = 'MUMTAZ' | 'JAYYID_JIDDAN' | 'JAYYID' | 'MAQBOOL' | 'DAEFE';

export interface HifzLog {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  date: string; // YYYY-MM-DD
  sabaqRange: string; // e.g. "Surah Al-Baqarah 1-25"
  sabqiJuz: number; // e.g. 2
  manzilJuz: number; // e.g. 5
  grade: HifzGrade;
  muallimName: string;
  notes?: string;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  examDate: string;
  juzTested: string; // e.g. "Juz 1-5 Comprehensive"
  hifzScore: number; // out of 40
  makharijScore: number; // out of 30
  tajweedScore: number; // out of 30
  totalScore: number; // out of 100
  grade: HifzGrade;
  examinerName: string;
  remarks: string;
}

export interface TuitionRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  guardianName: string;
  guardianPhone: string;
  month: string; // e.g. "Tikimt / October 2026"
  amountETB: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'SPONSORED';
  paymentMethod?: 'Telebirr' | 'CBE Birr' | 'Awash Bank' | 'Cash' | 'Endowment';
  sponsorName?: string;
  receiptNumber?: string;
  paidDate?: string;
}

export interface AdmissionApplication {
  id: string;
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  guardianName: string;
  phone: string;
  address: string;
  track: string;
  priorJuz: number;
  paymentChannel: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface DonationPledge {
  id: string;
  donorName: string;
  phoneOrEmail: string;
  amountETB: number;
  tier: 'Golden Pillar' | 'Silver Foundation' | 'Bronze Builder' | 'General Sadaqah';
  channel: 'Telebirr' | 'CBE Bank Transfer' | 'Awash Bank' | 'Cash' | 'Zelle/Intl';
  referenceNumber?: string;
  date: string;
  purpose: string;
}

export interface CloudConfig {
  googleScriptUrl?: string;
  connectedSpreadsheetId?: string;
  connectedSpreadsheetUrl?: string;
  connectedSpreadsheetTitle?: string;
  lastSyncedAt?: string;
  autoSyncEnabled?: boolean;
}

export interface UserSession {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'Super Admin' | 'Muallim Faculty' | 'Registrar';
}

export interface InstitutionSettings {
  nameEn: string;
  nameAr: string;
  locationEn: string;
  phone: string;
  whatsappUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  cbeAccount: string;
  awashAccount: string;
  telebirrAccount: string;
  tuitionFeeETB: number;
  vision2030TargetETB: number;
  chiefExaminer: string;
  headOfHalaqat: string;
}

