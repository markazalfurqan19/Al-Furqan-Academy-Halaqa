import React from 'react';
import { Student, HifzLog } from '../../types';
import { StudentDetailChart } from './StudentDetailChart';
import { AttendanceHeatmap } from './AttendanceHeatmap';
import { 
  X, 
  Printer, 
  BookOpen, 
  Award, 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  ShieldCheck, 
  User, 
  Phone,
  Edit3
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  hifzLogs: HifzLog[];
  onOpenLogModal: (student: Student) => void;
  onOpenReportModal: (student: Student) => void;
  onOpenCertModal: (student: Student) => void;
  onOpenAttendanceModal: () => void;
  onOpenNotifierModal: (student: Student) => void;
  onOpenIDCardModal: (student: Student) => void;
  onOpenEditModal?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  hifzLogs,
  onOpenLogModal,
  onOpenReportModal,
  onOpenCertModal,
  onOpenAttendanceModal,
  onOpenNotifierModal,
  onOpenIDCardModal,
  onOpenEditModal
}) => {
  if (!isOpen || !student) return null;

  const studentLogs = hifzLogs.filter(l => l.studentId === student.id || l.studentCode === student.code);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F5132] font-black text-xl flex items-center justify-center border border-emerald-200">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">{student.name}</h3>
                <span className="font-mono text-xs font-bold text-[#0F5132] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {student.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  student.status === 'GRADUATED' ? 'bg-purple-100 text-purple-900' :
                  student.status === 'KHATM_TRACK' ? 'bg-amber-100 text-amber-900' :
                  'bg-emerald-100 text-[#0F5132]'
                }`}>
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {student.age} yrs • {student.track} • {student.halaqahGroup}
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

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-2 my-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
          <button
            onClick={() => onOpenLogModal(student)}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Log Sabaq</span>
          </button>

          <button
            onClick={() => onOpenReportModal(student)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Transcript</span>
          </button>

          <button
            onClick={() => onOpenCertModal(student)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Award Certificate</span>
          </button>

          <button
            onClick={() => onOpenIDCardModal(student)}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ID Gate Pass</span>
          </button>

          <button
            onClick={() => onOpenNotifierModal(student)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Parent Alert</span>
          </button>

          {onOpenEditModal && (
            <button
              onClick={() => onOpenEditModal(student)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Edit student dossier, track, Juz level, attendance, or guardian contact"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Dossier</span>
            </button>
          )}

          <button
            onClick={onOpenAttendanceModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Roll Call</span>
          </button>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-5">
          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-2">
              Hifz Velocity & Cumulative Retention Curve
            </h4>
            <StudentDetailChart student={student} hifzLogs={hifzLogs} height={200} showCardWrapper={false} />
          </div>

          {/* Attendance Heatmap */}
          <AttendanceHeatmap student={student} />

          {/* Demographic & Guardian Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <span className="font-black text-gray-800 uppercase text-[10px] block">
                Academic Attributes
              </span>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Juz Progress:</span>
                <span className="font-bold text-[#0F5132]">Juz {student.juzLevel} / 30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Recitation Target:</span>
                <span className="font-bold text-gray-800">{student.currentSurah}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Daily Attendance Rate:</span>
                <span className="font-bold text-emerald-800">{student.dailyAttendance}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Enrollment Date:</span>
                <span className="font-mono text-gray-700">{student.enrollmentDate}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <span className="font-black text-gray-800 uppercase text-[10px] block">
                Guardian & Emergency Dossier
              </span>
              <div className="flex justify-between">
                <span className="text-gray-500">Guardian Full Name:</span>
                <span className="font-bold text-gray-800">{student.guardianName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Primary Phone:</span>
                <span className="font-mono text-gray-700">{student.guardianPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Group:</span>
                <span className="font-bold text-gray-800">{student.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Campus Location:</span>
                <span className="font-bold text-gray-800">Chiro Campus Halaqah Center</span>
              </div>
            </div>
          </div>

          {/* Recent Logs Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-100 p-3 text-xs font-bold text-gray-700 flex justify-between items-center">
              <span>Recent Sabaq & Evaluation History</span>
              <span className="text-[10px] text-gray-500 font-normal">{studentLogs.length} total recorded entries</span>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 text-xs">
              {studentLogs.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No sabaq entries recorded yet for this student.</div>
              ) : (
                studentLogs.map(l => (
                  <div key={l.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <div className="font-bold text-gray-900">{l.sabaqRange}</div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {l.date} • Sabqi: Juz {l.sabqiJuz} • Manzil: Juz {l.manzilJuz} • {l.muallimName}
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-[#0F5132] px-2.5 py-0.5 rounded-full font-black text-[10px]">
                      {l.grade}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
