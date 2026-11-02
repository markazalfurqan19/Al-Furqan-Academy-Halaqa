import { 
  Student, 
  HifzLog, 
  ExamRecord, 
  TuitionRecord, 
  AdmissionApplication, 
  DonationPledge 
} from '../types';

export const OFFICIAL_LOGO_URL = "/assets/aistudio/loog_6003b99d.jpg";

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'st-001',
    code: 'MF-2024-001',
    name: 'Abdurrahman Ziyad Kedir',
    age: 14,
    gender: 'MALE',
    track: 'Full-time Hifz (Imam Nafi)',
    currentSurah: 'Surah Al-Furqan (Ayah 45-77)',
    juzLevel: 19,
    dailyAttendance: 98,
    guardianName: 'Ziyad Kedir Ahmed',
    guardianPhone: '+251911223344',
    guardianEmail: 'ziyad.kedir@example.com',
    enrollmentDate: '2024-09-01',
    status: 'ACTIVE',
    bloodGroup: 'O+',
    halaqahGroup: 'Halaqah Ubayy ibn Kaab',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true, '2026-10-29': true, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  },
  {
    id: 'st-002',
    code: 'MF-2024-002',
    name: 'Fatima Mukhtar Osman',
    age: 13,
    gender: 'FEMALE',
    track: 'Full-time Hifz (Hafs an Asim)',
    currentSurah: 'Surah Maryam (Ayah 1-58)',
    juzLevel: 16,
    dailyAttendance: 96,
    guardianName: 'Mukhtar Osman Ali',
    guardianPhone: '+251922334455',
    guardianEmail: 'mukhtar.osman@example.com',
    enrollmentDate: '2024-09-05',
    status: 'ACTIVE',
    bloodGroup: 'A+',
    halaqahGroup: 'Halaqah Aisha bint Abi Bakr',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true, '2026-10-29': false, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  },
  {
    id: 'st-003',
    code: 'MF-2023-018',
    name: 'Hamza Bilal Jibril',
    age: 15,
    gender: 'MALE',
    track: 'Full-time Hifz (Khatm Track)',
    currentSurah: 'Surah Al-Insan to Al-Mursalat',
    juzLevel: 29,
    dailyAttendance: 99,
    guardianName: 'Bilal Jibril Mohammed',
    guardianPhone: '+251933445566',
    guardianEmail: 'bilal.jibril@example.com',
    enrollmentDate: '2023-02-15',
    status: 'KHATM_TRACK',
    bloodGroup: 'B+',
    halaqahGroup: 'Halaqah Ubayy ibn Kaab',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true, '2026-10-29': true, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  },
  {
    id: 'st-004',
    code: 'MF-2025-004',
    name: 'Maryam Ibro Abdurahman',
    age: 11,
    gender: 'FEMALE',
    track: 'Primary Foundation (Juz Amma)',
    currentSurah: 'Surah An-Naba to Al-Mutaffifin',
    juzLevel: 4,
    dailyAttendance: 92,
    guardianName: 'Ibro Abdurahman',
    guardianPhone: '+251944556677',
    guardianEmail: 'ibro.abdurahman@example.com',
    enrollmentDate: '2025-01-10',
    status: 'ACTIVE',
    bloodGroup: 'O-',
    halaqahGroup: 'Halaqah Khadijah',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': true, '2026-10-27': false, '2026-10-28': true, '2026-10-29': true, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  },
  {
    id: 'st-005',
    code: 'MF-2024-035',
    name: 'Zakariya Dawud Yusuf',
    age: 16,
    gender: 'MALE',
    track: 'Full-time Hifz (Intermediate)',
    currentSurah: 'Surah Yunus (Ayah 1-70)',
    juzLevel: 11,
    dailyAttendance: 88,
    guardianName: 'Dawud Yusuf Nur',
    guardianPhone: '+251955667788',
    guardianEmail: 'dawud.yusuf@example.com',
    enrollmentDate: '2024-03-20',
    status: 'REVISION',
    bloodGroup: 'AB+',
    halaqahGroup: 'Halaqah Zayd ibn Thabit',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': false, '2026-10-27': true, '2026-10-28': false, '2026-10-29': true, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  },
  {
    id: 'st-006',
    code: 'MF-2023-009',
    name: 'Sumayya Hasan Gemechu',
    age: 14,
    gender: 'FEMALE',
    track: 'Full-time Hifz (Khatm Honors)',
    currentSurah: 'Surah An-Nas (Completed 30 Juz)',
    juzLevel: 30,
    dailyAttendance: 100,
    guardianName: 'Hasan Gemechu',
    guardianPhone: '+251966778899',
    guardianEmail: 'hasan.gemechu@example.com',
    enrollmentDate: '2023-01-08',
    status: 'GRADUATED',
    bloodGroup: 'A+',
    halaqahGroup: 'Halaqah Aisha bint Abi Bakr',
    monthlyAttendanceHistory: {
      '2026-10-25': true, '2026-10-26': true, '2026-10-27': true, '2026-10-28': true, '2026-10-29': true, '2026-10-30': true, '2026-10-31': true, '2026-11-01': true
    }
  }
];

export const INITIAL_HIFZ_LOGS: HifzLog[] = [
  {
    id: 'log-001',
    studentId: 'st-001',
    studentName: 'Abdurrahman Ziyad Kedir',
    studentCode: 'MF-2024-001',
    date: '2026-11-01',
    sabaqRange: 'Surah Al-Furqan 61-77 (1 Page)',
    sabqiJuz: 19,
    manzilJuz: 6,
    grade: 'MUMTAZ',
    muallimName: "Ustadh Ziyad Abdullahi",
    notes: 'Flawless recitation with crisp Makharij on Ghunnah and Madd Munfasil.'
  },
  {
    id: 'log-002',
    studentId: 'st-002',
    studentName: 'Fatima Mukhtar Osman',
    studentCode: 'MF-2024-002',
    date: '2026-11-01',
    sabaqRange: 'Surah Maryam 35-58 (1.5 Pages)',
    sabqiJuz: 16,
    manzilJuz: 4,
    grade: 'MUMTAZ',
    muallimName: "Ustadh Ziyad Abdullahi",
    notes: 'Precise Waqf & Ibtida execution. Excellent retention of Sabqi.'
  },
  {
    id: 'log-003',
    studentId: 'st-003',
    studentName: 'Hamza Bilal Jibril',
    studentCode: 'MF-2023-018',
    date: '2026-11-01',
    sabaqRange: 'Surah Al-Mursalat 1-50 (Final Sabq of Juz 29)',
    sabqiJuz: 29,
    manzilJuz: 20,
    grade: 'MUMTAZ',
    muallimName: "Sheikh Nuruddin Ahmed",
    notes: 'Ready for final 30th Juz oral certification review next week inshaAllah.'
  },
  {
    id: 'log-004',
    studentId: 'st-004',
    studentName: 'Maryam Ibro Abdurahman',
    studentCode: 'MF-2025-004',
    date: '2026-10-31',
    sabaqRange: 'Surah Al-Infitar 1-19',
    sabqiJuz: 4,
    manzilJuz: 1,
    grade: 'JAYYID_JIDDAN',
    muallimName: "Ustadh Ziyad Abdullahi",
    notes: 'Minor hesitation on Ayah 14, cleared on second pass. Good rhythm.'
  },
  {
    id: 'log-005',
    studentId: 'st-005',
    studentName: 'Zakariya Dawud Yusuf',
    studentCode: 'MF-2024-035',
    date: '2026-10-31',
    sabaqRange: 'Surah Yunus 40-60',
    sabqiJuz: 11,
    manzilJuz: 3,
    grade: 'JAYYID',
    muallimName: "Sheikh Nuruddin Ahmed",
    notes: 'Needs extra repetition during morning Halaqah on Mutashabihat in Yunus.'
  }
];

export const INITIAL_EXAMS: ExamRecord[] = [
  {
    id: 'exam-001',
    studentId: 'st-001',
    studentName: 'Abdurrahman Ziyad Kedir',
    studentCode: 'MF-2024-001',
    examDate: '2026-10-20',
    juzTested: 'Juz 15 - 18 Evaluation',
    hifzScore: 39,
    makharijScore: 28,
    tajweedScore: 29,
    totalScore: 96,
    grade: 'MUMTAZ',
    examinerName: 'Sheikh Nuruddin Ahmed (Chief Examiner)',
    remarks: 'Commendable memory solidity. Commended for smooth transitions.'
  },
  {
    id: 'exam-002',
    studentId: 'st-002',
    studentName: 'Fatima Mukhtar Osman',
    studentCode: 'MF-2024-002',
    examDate: '2026-10-18',
    juzTested: 'Juz 11 - 15 Comprehensive',
    hifzScore: 38,
    makharijScore: 29,
    tajweedScore: 28,
    totalScore: 95,
    grade: 'MUMTAZ',
    examinerName: 'Sheikh Nuruddin Ahmed (Chief Examiner)',
    remarks: 'Clear distinction in Qalqalah cubra and sughra pronunciation.'
  },
  {
    id: 'exam-003',
    studentId: 'st-003',
    studentName: 'Hamza Bilal Jibril',
    studentCode: 'MF-2023-018',
    examDate: '2026-10-15',
    juzTested: 'Juz 21 - 28 Pre-Khatm Audit',
    hifzScore: 40,
    makharijScore: 29,
    tajweedScore: 30,
    totalScore: 99,
    grade: 'MUMTAZ',
    examinerName: 'Ustadh Ziyad Abdullahi',
    remarks: 'Gold standard performance. Approved for Final Khatm Ijaza Track.'
  }
];

export const INITIAL_TUITION: TuitionRecord[] = [
  {
    id: 'tuition-001',
    studentId: 'st-001',
    studentName: 'Abdurrahman Ziyad Kedir',
    studentCode: 'MF-2024-001',
    guardianName: 'Ziyad Kedir Ahmed',
    guardianPhone: '+251911223344',
    month: 'Tikimt / October 2026',
    amountETB: 800,
    status: 'PAID',
    paymentMethod: 'Telebirr',
    receiptNumber: 'RCP-2026-1092',
    paidDate: '2026-10-05'
  },
  {
    id: 'tuition-002',
    studentId: 'st-002',
    studentName: 'Fatima Mukhtar Osman',
    studentCode: 'MF-2024-002',
    guardianName: 'Mukhtar Osman Ali',
    guardianPhone: '+251922334455',
    month: 'Tikimt / October 2026',
    amountETB: 800,
    status: 'PAID',
    paymentMethod: 'CBE Birr',
    receiptNumber: 'RCP-2026-1093',
    paidDate: '2026-10-06'
  },
  {
    id: 'tuition-003',
    studentId: 'st-004',
    studentName: 'Maryam Ibro Abdurahman',
    studentCode: 'MF-2025-004',
    guardianName: 'Ibro Abdurahman',
    guardianPhone: '+251944556677',
    month: 'Tikimt / October 2026',
    amountETB: 800,
    status: 'SPONSORED',
    sponsorName: 'Hajji Ahmed Foundation (Kafalat al-Yateem)',
    receiptNumber: 'KAF-2026-0044',
    paidDate: '2026-10-01'
  },
  {
    id: 'tuition-004',
    studentId: 'st-005',
    studentName: 'Zakariya Dawud Yusuf',
    studentCode: 'MF-2024-035',
    guardianName: 'Dawud Yusuf Nur',
    guardianPhone: '+251955667788',
    month: 'Tikimt / October 2026',
    amountETB: 800,
    status: 'PENDING'
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-001',
    fullName: 'Yusuf Ibrahim Taha',
    gender: 'MALE',
    age: 12,
    guardianName: 'Ibrahim Taha',
    phone: '+251912556677',
    address: 'Chiro Town, Kebele 02 near Grand Mosque',
    track: 'Full-time Hifz (Boarding)',
    priorJuz: 3,
    paymentChannel: 'Telebirr',
    submissionDate: '2026-10-28',
    status: 'PENDING',
    notes: 'Good Tajweed foundation from local mosque Maktab.'
  },
  {
    id: 'adm-002',
    fullName: 'Amina Salih Mohammed',
    gender: 'FEMALE',
    age: 10,
    guardianName: 'Salih Mohammed',
    phone: '+251923447788',
    address: 'Chiro Rural Woreda, Hararghe',
    track: 'Weekend & Evening Halaqah',
    priorJuz: 1,
    paymentChannel: 'CBE Bank Transfer',
    submissionDate: '2026-10-25',
    status: 'APPROVED',
    notes: 'Enrolled into Halaqah Khadijah starting next Monday.'
  }
];

export const INITIAL_PLEDGES: DonationPledge[] = [
  {
    id: 'pl-001',
    donorName: 'Hajji Mohammed Harun & Family',
    phoneOrEmail: '+251911440011',
    amountETB: 250000,
    tier: 'Golden Pillar',
    channel: 'CBE Bank Transfer',
    referenceNumber: 'CBE-TX-88371902',
    date: '2026-10-15',
    purpose: 'Vision 2030 New Academic Block & Hifz Library'
  },
  {
    id: 'pl-002',
    donorName: 'Chiro Diaspora Association (USA & Europe)',
    phoneOrEmail: 'chiro.diaspora@example.org',
    amountETB: 500000,
    tier: 'Golden Pillar',
    channel: 'Awash Bank',
    referenceNumber: 'AWH-INT-29481',
    date: '2026-10-18',
    purpose: 'Solar Energy & Pure Water Well for Student Campus'
  },
  {
    id: 'pl-003',
    donorName: 'Ustadh Jamal Abdullahi',
    phoneOrEmail: '+251922998877',
    amountETB: 25000,
    tier: 'Silver Foundation',
    channel: 'Telebirr',
    referenceNumber: 'TB-99201948',
    date: '2026-10-29',
    purpose: 'Kafalat al-Yateem Student Sponsorship Fund'
  }
];

export const INITIAL_SETTINGS = {
  nameEn: 'Markazul Furqan Quranic & Academic Institution',
  nameAr: 'مركز الفرقان لتحفيظ القرآن الكريم',
  locationEn: 'Chiro, West Hararghe Zone, Oromia, Ethiopia',
  phone: '+251935097339',
  whatsappUrl: 'https://wa.me/251935097339',
  telegramUrl: 'https://t.me/+251935097339',
  youtubeUrl: 'https://www.youtube.com/@kadirhamzasiyum',
  tiktokUrl: 'https://www.tiktok.com/@markazulfurqaan44?is_from_webapp=1&sender_device=pc',
  cbeAccount: '1000 2938 4819 2',
  awashAccount: '0132 0948 1029 00',
  telebirrAccount: '+251935097339',
  tuitionFeeETB: 800,
  vision2030TargetETB: 10000000,
  chiefExaminer: 'Sheikh Nuruddin Ahmed (Chief Examiner)',
  headOfHalaqat: 'Ustadh Ziyad Abdullahi'
};

