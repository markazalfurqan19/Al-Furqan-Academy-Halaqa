import { 
  Student, 
  HifzLog, 
  ExamRecord, 
  TuitionRecord, 
  AdmissionApplication, 
  DonationPledge 
} from '../types';

export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Creates a brand-new official Markazul Furqan Google Spreadsheet
 * preconfigured with properly named sheets for Analytics, Roster, Logs, Exams, Tuition, and Pledges.
 */
export async function createMarkazulFurqanSpreadsheet(
  accessToken: string,
  customTitle?: string
): Promise<SheetCreationResult> {
  const title = customTitle || `Markazul Furqan Academic Ledger - ${new Date().toISOString().split('T')[0]}`;

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        { properties: { title: 'Executive Analytics', tabColor: { red: 0.1, green: 0.5, blue: 0.3 } } },
        { properties: { title: 'Students Roster', tabColor: { red: 0.05, green: 0.32, blue: 0.20 } } },
        { properties: { title: 'Sabaq Logs', tabColor: { red: 0.15, green: 0.40, blue: 0.85 } } },
        { properties: { title: 'Oral Exams', tabColor: { red: 0.83, green: 0.68, blue: 0.21 } } },
        { properties: { title: 'Tuition & Kafalat', tabColor: { red: 0.50, green: 0.15, blue: 0.65 } } },
        { properties: { title: 'Admissions', tabColor: { red: 0.85, green: 0.45, blue: 0.10 } } },
        { properties: { title: 'Vision 2030 Pledges', tabColor: { red: 0.10, green: 0.60, blue: 0.35 } } },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to create Google Spreadsheet (Status ${response.status})`);
  }

  const result = await response.json();
  const spreadsheetId = result.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: result.properties?.title || title,
  };
}

/**
 * Fetches basic metadata of a spreadsheet to verify user access and read sheet names
 */
export async function getSpreadsheetDetails(accessToken: string, spreadsheetId: string) {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Could not access spreadsheet ${spreadsheetId}`);
  }

  const data = await response.json();
  return {
    title: data.properties?.title || 'Connected Sheet',
    sheets: (data.sheets || []).map((s: any) => s.properties?.title),
  };
}

/**
 * Pushes all in-memory datasets into the specified Google Spreadsheet
 * Includes dynamic analytics formulas and KPI summary rows
 */
export async function syncAllDataToGoogleSheet(
  accessToken: string,
  spreadsheetId: string,
  data: {
    students: Student[];
    hifzLogs: HifzLog[];
    exams: ExamRecord[];
    tuition: TuitionRecord[];
    admissions: AdmissionApplication[];
    pledges: DonationPledge[];
  }
) {
  // 1. Executive Analytics & KPIs tab
  const totalTuitionETB = data.tuition.reduce((sum, t) => sum + (t.amountETB || 0), 0);
  const paidTuitionETB = data.tuition.filter(t => t.status === 'PAID').reduce((sum, t) => sum + (t.amountETB || 0), 0);
  const totalPledgesETB = data.pledges.reduce((sum, p) => sum + (p.amountETB || 0), 0);
  const avgAttendance = data.students.length 
    ? (data.students.reduce((sum, s) => sum + s.dailyAttendance, 0) / data.students.length).toFixed(1)
    : '100';

  const analyticsRows = [
    ['MARKAZUL FURQAN QURANIC ACADEMY - EXECUTIVE ANALYTICS & DATA REPOSITORY'],
    [`Generated Timestamp: ${new Date().toLocaleString()}`, `Institution Location: Chiro (Asebe Teferi), West Hararghe, Ethiopia`],
    [],
    ['METRIC / KPI', 'CALCULATED VALUE', 'BENCHMARK / STATUS', 'FORMULA REFERENCE'],
    ['Total Enrolled Students', data.students.length, 'Active Roster', "=COUNTA('Students Roster'!A2:A)"],
    ['Active Students', data.students.filter(s => s.status === 'ACTIVE').length, 'Regular Attendance', '=COUNTIF(\'Students Roster\'!K2:K, "ACTIVE")'],
    ['Khatm Track Candidates', data.students.filter(s => s.status === 'KHATM_TRACK').length, 'Advanced Hifz Stage', '=COUNTIF(\'Students Roster\'!K2:K, "KHATM_TRACK")'],
    ['Male Students', data.students.filter(s => s.gender === 'MALE').length, 'Boys Halaqat', '=COUNTIF(\'Students Roster\'!D2:D, "MALE")'],
    ['Female Students', data.students.filter(s => s.gender === 'FEMALE').length, 'Girls Halaqat', '=COUNTIF(\'Students Roster\'!D2:D, "FEMALE")'],
    ['Average Daily Attendance %', `${avgAttendance}%`, 'Threshold: 85%', "=AVERAGE('Students Roster'!H2:H)"],
    ['Total Tuition Billed (ETB)', `${totalTuitionETB.toLocaleString()} ETB`, 'Current Cycle', "=SUM('Tuition & Kafalat'!G2:G)"],
    ['Tuition Collected (ETB)', `${paidTuitionETB.toLocaleString()} ETB`, 'Collected in Cash/Bank', '=SUMIF(\'Tuition & Kafalat\'!H2:H, "PAID", \'Tuition & Kafalat\'!G2:G)'],
    ['Pending Tuition (ETB)', `${(totalTuitionETB - paidTuitionETB).toLocaleString()} ETB`, 'Outstanding Accounts', '=SUMIF(\'Tuition & Kafalat\'!H2:H, "PENDING", \'Tuition & Kafalat\'!G2:G)'],
    ['Vision 2030 Donations Pledged (ETB)', `${totalPledgesETB.toLocaleString()} ETB`, 'Expansion Fund', "=SUM('Vision 2030 Pledges'!E2:E)"],
    ['Oral Exam Records Evaluated', data.exams.length, 'Certified Scores', "=COUNTA('Oral Exams'!A2:A)"],
    ['Total Daily Sabaq Logs', data.hifzLogs.length, 'Recitation Evaluated', "=COUNTA('Sabaq Logs'!A2:A)"],
    ['Pending Admission Applications', data.admissions.filter(a => a.status === 'PENDING').length, 'Needs Review', '=COUNTIF(\'Admissions\'!K2:K, "PENDING")'],
  ];

  // 2. Format tables
  const studentsRows = [
    ['Student ID', 'Full Name', 'Age', 'Gender', 'Halaqah Track', 'Current Surah', 'Juz Progress (/30)', 'Attendance %', 'Guardian Name', 'Guardian Phone', 'Status', 'Enrollment Date'],
    ...data.students.map(s => [
      s.code,
      s.name,
      s.age,
      s.gender,
      s.track,
      s.currentSurah,
      s.juzLevel,
      s.dailyAttendance,
      s.guardianName,
      s.guardianPhone,
      s.status,
      s.enrollmentDate
    ])
  ];

  const logsRows = [
    ['Log Date', 'Student Code', 'Student Name', 'Sabaq (New Lesson)', 'Sabqi (Recent Juz)', 'Manzil (Cycle Juz)', 'Evaluation Grade', 'Muallim Faculty', 'Notes & Recitation Remarks'],
    ...data.hifzLogs.map(l => [
      l.date,
      l.studentCode,
      l.studentName,
      l.sabaqRange,
      l.sabqiJuz,
      l.manzilJuz,
      l.grade,
      l.muallimName,
      l.notes || ''
    ])
  ];

  const examsRows = [
    ['Exam Date', 'Student Code', 'Candidate Name', 'Tested Scope', 'Hifz Score (/40)', 'Makharij Score (/30)', 'Tajweed Score (/30)', 'Total (/100)', 'Grade', 'Examiner Name', 'Remarks'],
    ...data.exams.map(e => [
      e.examDate,
      e.studentCode,
      e.studentName,
      e.juzTested,
      e.hifzScore,
      e.makharijScore,
      e.tajweedScore,
      e.totalScore,
      e.grade,
      e.examinerName,
      e.remarks
    ])
  ];

  const tuitionRows = [
    ['Receipt Number', 'Student Code', 'Student Name', 'Guardian Name', 'Guardian Phone', 'Billing Month', 'Amount (ETB)', 'Payment Status', 'Payment Method / Sponsor', 'Date Paid'],
    ...data.tuition.map(t => [
      t.receiptNumber || 'N/A',
      t.studentCode,
      t.studentName,
      t.guardianName,
      t.guardianPhone,
      t.month,
      t.amountETB,
      t.status,
      t.sponsorName ? `Sponsor: ${t.sponsorName}` : (t.paymentMethod || 'Direct'),
      t.paidDate || 'N/A'
    ])
  ];

  const admissionsRows = [
    ['Submission Date', 'Applicant Full Name', 'Age', 'Gender', 'Target Track', 'Prior Memorization (Juz)', 'Guardian Name', 'Guardian Contact', 'Address', 'Payment Channel', 'Review Status'],
    ...data.admissions.map(a => [
      a.submissionDate,
      a.fullName,
      a.age,
      a.gender,
      a.track,
      a.priorJuz,
      a.guardianName,
      a.phone,
      a.address,
      a.paymentChannel,
      a.status
    ])
  ];

  const pledgesRows = [
    ['Pledge Date', 'Donor Name', 'Contact Info', 'Sponsorship Tier', 'Donation Amount (ETB)', 'Payment Channel', 'Bank / Transaction Ref', 'Intended Purpose'],
    ...data.pledges.map(p => [
      p.date,
      p.donorName,
      p.phoneOrEmail,
      p.tier,
      p.amountETB,
      p.channel,
      p.referenceNumber || 'N/A',
      p.purpose
    ])
  ];

  // Prepare batch update values
  const payload = {
    valueInputOption: 'USER_ENTERED',
    data: [
      { range: 'Executive Analytics!A1:D25', values: analyticsRows },
      { range: 'Students Roster!A1:L', values: studentsRows },
      { range: 'Sabaq Logs!A1:I', values: logsRows },
      { range: 'Oral Exams!A1:K', values: examsRows },
      { range: 'Tuition & Kafalat!A1:J', values: tuitionRows },
      { range: 'Admissions!A1:K', values: admissionsRows },
      { range: 'Vision 2030 Pledges!A1:H', values: pledgesRows },
    ]
  };

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Failed to update spreadsheet data (Status ${response.status})`);
  }

  return await response.json();
}
