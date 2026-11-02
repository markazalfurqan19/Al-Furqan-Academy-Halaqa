import React, { useState } from 'react';
import { Student } from '../../types';
import { Calendar, CheckCircle2, XCircle, X, Save, Check } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveAttendance: (updatedStudents: Student[]) => Promise<void> | void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  students,
  onSaveAttendance
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayStr);
  const [statuses, setStatuses] = useState<{ [studentId: string]: boolean }>(() => {
    const initial: { [id: string]: boolean } = {};
    students.forEach(s => {
      initial[s.id] = s.monthlyAttendanceHistory?.[todayStr] !== undefined
        ? s.monthlyAttendanceHistory[todayStr]
        : true;
    });
    return initial;
  });

  if (!isOpen) return null;

  const toggleStudent = (id: string) => {
    setStatuses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (present: boolean) => {
    const updated: { [id: string]: boolean } = {};
    students.forEach(s => {
      updated[s.id] = present;
    });
    setStatuses(updated);
  };

  const handleSave = async () => {
    const updatedStudents: Student[] = students.map(s => {
      const isPresent = statuses[s.id] ?? true;
      const history = { ...(s.monthlyAttendanceHistory || {}) };
      history[attendanceDate] = isPresent;

      // Recalculate attendance %
      const historyValues = Object.values(history);
      const presents = historyValues.filter(Boolean).length;
      const calculatedAttendance = Math.round((presents / (historyValues.length || 1)) * 100);

      return {
        ...s,
        dailyAttendance: calculatedAttendance,
        monthlyAttendanceHistory: history
      };
    });

    await onSaveAttendance(updatedStudents);
    onClose();
  };

  const presentCount = Object.values(statuses).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Daily Halaqah Roll Call & Attendance
              </h3>
              <p className="text-xs text-gray-500">
                Mark morning & afternoon presence for Chiro halaqat
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

        {/* Date and Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600">Roll Date:</span>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#0F5132]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => markAll(true)}
              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => markAll(false)}
              className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Student Roll Table */}
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-2xl mb-4">
          {students.map(s => {
            const isPresent = statuses[s.id] ?? true;
            return (
              <div 
                key={s.id} 
                onClick={() => toggleStudent(s.id)}
                className={`p-3 flex items-center justify-between cursor-pointer transition select-none ${
                  isPresent ? 'bg-white hover:bg-emerald-50/50' : 'bg-red-50/40 hover:bg-red-50'
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold text-gray-900">{s.name}</div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {s.code} • {s.halaqahGroup} • Current rate: {s.dailyAttendance}%
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full transition ${
                    isPresent
                      ? 'bg-emerald-100 text-[#0F5132]'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>{isPresent ? 'Present' : 'Absent'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-semibold">
            Tally: <strong className="text-emerald-800">{presentCount} Present</strong> / {students.length - presentCount} Absent
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save & Recalculate Roll</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
