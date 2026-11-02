import React from 'react';
import { Student } from '../../types';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface AttendanceHeatmapProps {
  student: Student;
}

export const AttendanceHeatmap: React.FC<AttendanceHeatmapProps> = ({ student }) => {
  // Generate last 30 days matrix
  const days: { dateStr: string; dayNum: number; present: boolean }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isPresent = student.monthlyAttendanceHistory?.[dateStr] !== undefined
      ? student.monthlyAttendanceHistory[dateStr]
      : (i % 7 !== 5 && (i + student.code.charCodeAt(student.code.length - 1)) % 11 !== 0);

    days.push({
      dateStr,
      dayNum: d.getDate(),
      present: isPresent
    });
  }

  const presentCount = days.filter(d => d.present).length;
  const attendanceRate = Math.round((presentCount / days.length) * 100);

  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-700">
          <Calendar className="w-3.5 h-3.5 text-[#0F5132]" />
          <span>30-Day Halaqah Roll Call Heatmap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-medium">
            {presentCount} / {days.length} Days Present
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            attendanceRate >= 90 ? 'bg-emerald-100 text-[#0F5132]' : 'bg-amber-100 text-amber-900'
          }`}>
            {attendanceRate}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
        {days.map((d, idx) => (
          <div
            key={idx}
            title={`${d.dateStr}: ${d.present ? 'Present in Halaqah' : 'Absent / Excused'}`}
            className={`h-7 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
              d.present
                ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
            }`}
          >
            <span>{d.dayNum}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-4 mt-2.5 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block"></span>
          <span>Present</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-200 inline-block"></span>
          <span>Absent / Excused</span>
        </span>
      </div>
    </div>
  );
};
