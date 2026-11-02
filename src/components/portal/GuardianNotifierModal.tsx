import React, { useState } from 'react';
import { Student, HifzLog } from '../../types';
import { 
  generateWhatsAppUrl, 
  generateSmsUrl, 
  buildDailySabaqMessage, 
  buildAttendanceAlertMessage 
} from '../../utils/messaging';
import { MessageCircle, Phone, X, Send, Copy, Check, ChevronDown } from 'lucide-react';

interface GuardianNotifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  initialStudent: Student | null;
  hifzLogs: HifzLog[];
}

export const GuardianNotifierModal: React.FC<GuardianNotifierModalProps> = ({
  isOpen,
  onClose,
  students,
  initialStudent,
  hifzLogs
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [templateType, setTemplateType] = useState<'SABAQ' | 'ATTENDANCE' | 'CUSTOM'>('SABAQ');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || initialStudent || students[0];
  const recentLog = hifzLogs.find(l => l.studentId === currentStudent?.id || l.studentCode === currentStudent?.code);

  let messageText = '';
  if (currentStudent) {
    if (templateType === 'SABAQ') {
      messageText = `Assalamu Alaykum ${currentStudent.guardianName},
Daily Academic Progress from Markazul Furqan (Chiro, Ethiopia):
Student: ${currentStudent.name} (${currentStudent.code})
Progress: Juz ${currentStudent.juzLevel}/30 • Current Surah: ${currentStudent.currentSurah}
Recent Sabaq: ${recentLog ? `${recentLog.sabaqRange} (Grade: ${recentLog.grade})` : 'Sabaq successfully cleared'}
Attendance: ${currentStudent.dailyAttendance}%
Jazakumullahu Khayran!`;
    } else if (templateType === 'ATTENDANCE') {
      messageText = buildAttendanceAlertMessage(currentStudent);
    } else {
      messageText = `Assalamu Alaykum ${currentStudent.guardianName},
Important announcement regarding ${currentStudent.name} from Markazul Furqan Administration in Chiro.
Please reach out to the office or visit during morning office hours.
Contact / WhatsApp / Telegram: +251935097339`;
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Guardian Notification Dispatch
              </h3>
              <p className="text-xs text-gray-500">
                Instant WhatsApp & SMS alerts to parents in Chiro & diaspora
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

        {/* Form Inputs */}
        <div className="space-y-4 my-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Select Student & Guardian:
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#0F5132]"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - {s.guardianName} ({s.guardianPhone})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Select Message Format:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTemplateType('SABAQ')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  templateType === 'SABAQ'
                    ? 'bg-[#0F5132] text-white border-[#0F5132]'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Sabaq Report
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('ATTENDANCE')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  templateType === 'ATTENDANCE'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Roll Warning
              </button>
              <button
                type="button"
                onClick={() => setTemplateType('CUSTOM')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  templateType === 'CUSTOM'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Admin Notice
              </button>
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-600">
                Message Preview:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-[#0F5132] hover:underline flex items-center gap-1 font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={messageText}
              className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Dispatch Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          {currentStudent && (
            <>
              <a
                href={generateWhatsAppUrl(currentStudent.guardianPhone, messageText)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp</span>
              </a>

              <a
                href={generateSmsUrl(currentStudent.guardianPhone, messageText)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-2.5 rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Send via SMS</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
