import { Student } from '../types';

export const OFFICIAL_PHONE = '+251935097339';
export const OFFICIAL_WHATSAPP_URL = 'https://wa.me/251935097339';
export const OFFICIAL_TELEGRAM_URL = 'https://t.me/+251935097339';
export const OFFICIAL_YOUTUBE_URL = 'https://www.youtube.com/@kadirhamzasiyum';
export const OFFICIAL_TIKTOK_URL = 'https://www.tiktok.com/@markazulfurqaan44?is_from_webapp=1&sender_device=pc';

export function sanitizePhoneNumber(phone: string): string {
  // Remove spaces, hyphens, and parentheses
  return phone.replace(/[\s\-\(\)]/g, '');
}

export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumber(phone).replace(/^\+/, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateSmsUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
}

export function generateTelegramUrl(phoneOrUsername: string, message?: string): string {
  const clean = sanitizePhoneNumber(phoneOrUsername);
  const base = clean.startsWith('+') || /^\d+$/.test(clean) ? `https://t.me/${clean}` : `https://t.me/${clean.replace('@', '')}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildDailySabaqMessage(student: Student): string {
  return `Assalamu Alaykum ${student.guardianName},
This is Markazul Furqan Quranic Academy (Chiro, Ethiopia).
Your child ${student.name} (${student.code}) has attained Juz ${student.juzLevel}/30 progress.
Current recitation target: ${student.currentSurah}.
Current attendance rate: ${student.dailyAttendance}%.
May Allah bless their Quranic journey and grant them steadfastness!
Jazakumullahu Khayran.
Contact / WhatsApp: ${OFFICIAL_PHONE}`;
}

export function buildAttendanceAlertMessage(student: Student): string {
  return `Assalamu Alaykum ${student.guardianName},
Urgent Attendance Alert from Markazul Furqan Academic Ledger:
Please be advised regarding student ${student.name} (${student.code}).
Current monthly attendance stands at ${student.dailyAttendance}%.
Kindly ensure prompt attendance for morning and afternoon Halaqah sessions.
Contact Administration: ${OFFICIAL_PHONE} / info@markazulfurqan.edu.et`;
}
