import React from 'react';
import { Student, HifzLog } from '../../types';
import { TrendingUp, Calendar, BookOpen, CheckCircle } from 'lucide-react';

interface StudentDetailChartProps {
  student: Student;
  hifzLogs: HifzLog[];
  height?: number;
  showCardWrapper?: boolean;
}

export const StudentDetailChart: React.FC<StudentDetailChartProps> = ({
  student,
  hifzLogs,
  height = 200,
  showCardWrapper = true
}) => {
  const studentLogs = hifzLogs.filter(l => l.studentId === student.id || l.studentCode === student.code);
  const totalJuz = 30;
  const currentJuz = student.juzLevel;
  const percentComplete = Math.round((currentJuz / totalJuz) * 100);

  // Generate individual velocity curve points based on student's current juz level
  const points = [
    { label: 'Start', juz: Math.max(0, currentJuz - 8) },
    { label: '-4 Mo', juz: Math.max(0, currentJuz - 6) },
    { label: '-3 Mo', juz: Math.max(0, currentJuz - 4.5) },
    { label: '-2 Mo', juz: Math.max(0, currentJuz - 3) },
    { label: 'Last Mo', juz: Math.max(0, currentJuz - 1.2) },
    { label: 'Current', juz: currentJuz },
  ];

  const chartWidth = 460;
  const chartHeight = height;
  const paddingX = 35;
  const paddingY = 22;

  const getX = (idx: number) => paddingX + (idx / (points.length - 1)) * (chartWidth - paddingX * 2);
  const getY = (val: number) => chartHeight - paddingY - (val / totalJuz) * (chartHeight - paddingY * 2);

  const polylinePoints = points.map((p, idx) => `${getX(idx)},${getY(p.juz)}`).join(' ');
  const areaPoints = `${getX(0)},${chartHeight - paddingY} ` + polylinePoints + ` ${getX(points.length - 1)},${chartHeight - paddingY}`;

  const content = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-black text-[#0F5132] text-sm">
            {student.name} ({student.code})
          </span>
          <span className="bg-emerald-100 text-[#0F5132] font-black px-2 py-0.5 rounded-full text-[10px]">
            {percentComplete}% Complete
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-semibold">
          <span>Target: 30 Juz Complete</span>
          <span>•</span>
          <span>Halaqah: {student.halaqahGroup}</span>
        </div>
      </div>

      <div className="relative w-full bg-slate-50/60 p-3 rounded-2xl border border-gray-100">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height: `${height}px` }}>
          <defs>
            <linearGradient id={`studGrad-${student.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0F5132" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          {[0, 10, 20, 30].map(val => (
            <g key={val}>
              <line 
                x1={paddingX} 
                y1={getY(val)} 
                x2={chartWidth - paddingX} 
                y2={getY(val)} 
                stroke="#E2E8F0" 
                strokeDasharray="3 3" 
              />
              <text 
                x={paddingX - 6} 
                y={getY(val) + 3} 
                fontSize="8.5" 
                fill="#94A3B8" 
                textAnchor="end"
              >
                J{val}
              </text>
            </g>
          ))}

          <polygon points={areaPoints} fill={`url(#studGrad-${student.id})`} />
          <polyline 
            points={polylinePoints} 
            fill="none" 
            stroke="#D4AF37" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {points.map((p, idx) => (
            <g key={idx}>
              <circle 
                cx={getX(idx)} 
                cy={getY(p.juz)} 
                r="3.5" 
                fill="#0F5132" 
                stroke="#D4AF37" 
                strokeWidth="2" 
              />
              <text 
                x={getX(idx)} 
                y={chartHeight - 4} 
                fontSize="8.5" 
                fontWeight="600" 
                fill="#64748B" 
                textAnchor="middle"
              >
                {p.label}
              </text>
              <text 
                x={getX(idx)} 
                y={getY(p.juz) - 6} 
                fontSize="8" 
                fontWeight="bold" 
                fill="#0F5132" 
                textAnchor="middle"
              >
                {p.juz}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
          <span className="text-[10px] text-gray-500 font-bold block">Current Surah</span>
          <span className="font-extrabold text-[#0F5132] truncate block mt-0.5">
            {student.currentSurah}
          </span>
        </div>
        <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-100">
          <span className="text-[10px] text-gray-500 font-bold block">Recorded Sabaqs</span>
          <span className="font-extrabold text-amber-900 block mt-0.5">
            {studentLogs.length} Entries
          </span>
        </div>
        <div className="bg-blue-50/70 p-2 rounded-xl border border-blue-100">
          <span className="text-[10px] text-gray-500 font-bold block">Attendance</span>
          <span className="font-extrabold text-blue-900 block mt-0.5">
            {student.dailyAttendance}%
          </span>
        </div>
      </div>
    </div>
  );

  if (!showCardWrapper) return content;

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
      {content}
    </div>
  );
};
