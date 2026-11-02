import React from 'react';
import { Student, HifzLog } from '../../types';
import { TrendingUp, Award, Users, BookOpen } from 'lucide-react';

interface HifzProgressChartProps {
  students: Student[];
  hifzLogs: HifzLog[];
}

export const HifzProgressChart: React.FC<HifzProgressChartProps> = ({ students, hifzLogs }) => {
  // Compute Juz brackets
  const brackets = [
    { label: 'Juz 1-5 (Foundational)', count: students.filter(s => s.juzLevel <= 5).length, color: 'bg-emerald-400' },
    { label: 'Juz 6-15 (Intermediate)', count: students.filter(s => s.juzLevel > 5 && s.juzLevel <= 15).length, color: 'bg-emerald-600' },
    { label: 'Juz 16-25 (Advanced)', count: students.filter(s => s.juzLevel > 15 && s.juzLevel <= 25).length, color: 'bg-amber-500' },
    { label: 'Juz 26-30 (Khatm Honors)', count: students.filter(s => s.juzLevel > 25).length, color: 'bg-amber-600' },
  ];

  const total = students.length || 1;
  const khatmCount = students.filter(s => s.juzLevel >= 30).length;
  const avgJuz = (students.reduce((acc, s) => acc + s.juzLevel, 0) / total).toFixed(1);
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.dailyAttendance, 0) / total);

  // Month-by-month progress curve simulation points
  const points = [
    { month: 'Jun', juz: 12.1 },
    { month: 'Jul', juz: 13.4 },
    { month: 'Aug', juz: 14.8 },
    { month: 'Sep', juz: 16.2 },
    { month: 'Oct', juz: 17.5 },
    { month: 'Nov', juz: Number(avgJuz) },
  ];

  const maxVal = 30;
  const minVal = 0;
  const chartHeight = 130;
  const chartWidth = 520;
  const paddingX = 40;
  const paddingY = 20;

  const getX = (idx: number) => paddingX + (idx / (points.length - 1)) * (chartWidth - paddingX * 2);
  const getY = (val: number) => chartHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);

  const polylinePoints = points.map((p, idx) => `${getX(idx)},${getY(p.juz)}`).join(' ');
  const areaPoints = `${getX(0)},${chartHeight - paddingY} ` + polylinePoints + ` ${getX(points.length - 1)},${chartHeight - paddingY}`;

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
              Markazul Furqan Hifz Velocity & Retention Curve
            </h3>
            <span className="bg-emerald-100 text-[#0F5132] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Live Chiro Halaqat
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Institutional memorization trajectory, milestone brackets, and cohort averages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-gray-500 font-bold block">Cohort Average</span>
            <span className="text-sm font-black text-[#0F5132]">Juz {avgJuz} / 30</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-gray-500 font-bold block">Avg Attendance</span>
            <span className="text-sm font-black text-amber-900">{avgAttendance}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Line Graph */}
        <div className="lg:col-span-7 bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-2">
            <span className="flex items-center gap-1.5 text-[#0F5132]">
              <TrendingUp className="w-3.5 h-3.5" />
              Cohort Juz Memorization Pace (Last 6 Months)
            </span>
            <span className="text-[11px] text-gray-400">Target: 30 Juz Complete</span>
          </div>

          <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F5132" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F5132" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
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
                    x={paddingX - 8} 
                    y={getY(val) + 3} 
                    fontSize="9" 
                    fill="#94A3B8" 
                    textAnchor="end"
                    fontFamily="sans-serif"
                  >
                    Juz {val}
                  </text>
                </g>
              ))}

              {/* Shaded Area */}
              <polygon points={areaPoints} fill="url(#chartGradient)" />

              {/* Line */}
              <polyline 
                points={polylinePoints} 
                fill="none" 
                stroke="#0F5132" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Data points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={getX(idx)} 
                    cy={getY(p.juz)} 
                    r="4" 
                    fill="#D4AF37" 
                    stroke="#0F5132" 
                    strokeWidth="2" 
                  />
                  <text 
                    x={getX(idx)} 
                    y={chartHeight - 4} 
                    fontSize="9.5" 
                    fontWeight="bold" 
                    fill="#64748B" 
                    textAnchor="middle"
                  >
                    {p.month}
                  </text>
                  <text 
                    x={getX(idx)} 
                    y={getY(p.juz) - 7} 
                    fontSize="9" 
                    fontWeight="800" 
                    fill="#0F5132" 
                    textAnchor="middle"
                  >
                    {p.juz}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Milestone Distribution Progress Bars */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">
            Student Distribution by Memorized Volume
          </h4>
          
          <div className="space-y-2.5">
            {brackets.map((b, idx) => {
              const pct = Math.round((b.count / total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-gray-700">{b.label}</span>
                    <span className="font-black text-[#0F5132]">{b.count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${b.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Khatm al-Quran Graduates: <strong>{khatmCount}</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Logged Sabaqs: <strong>{hifzLogs.length}</strong></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
