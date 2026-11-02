import React from 'react';
import { Student } from '../../types';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';
import { ShieldCheck, Phone, MapPin, Award } from 'lucide-react';

interface StudentIDCardProps {
  student: Student;
}

export const StudentIDCard: React.FC<StudentIDCardProps> = ({ student }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-[#0A3622] via-[#0F5132] to-[#0A3622] text-white rounded-3xl p-5 shadow-2xl border-2 border-[#D4AF37] relative overflow-hidden select-none print:shadow-none print:border-black">
      {/* Decorative Gold Watermark & Arches */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white p-0.5 shadow-sm shrink-0">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Al-Furqan Quran Center Emblem" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="text-[9px] font-arabic text-[#E9C46A] leading-none mb-0.5 font-bold">
              مركز الفرقان لتحفيظ القرآن
            </div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white">
              Markazul Furqan
            </h4>
            <p className="text-[8.5px] text-emerald-200 uppercase tracking-widest font-semibold">
              Chiro • West Hararghe • Ethiopia
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] bg-[#D4AF37] text-gray-950 font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
            Halaqah Pass
          </span>
          <span className="block text-[8px] text-emerald-300 font-mono mt-0.5">2018/19 E.C.</span>
        </div>
      </div>

      {/* Student Profile Info */}
      <div className="flex items-center gap-4 my-3">
        <div className="w-20 h-24 rounded-2xl bg-emerald-950/80 border-2 border-[#D4AF37] flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#E9C46A] font-black text-sm mb-1">
            {student.name.charAt(0)}
          </div>
          <span className="text-[8px] text-emerald-200 font-bold uppercase">Candidate</span>
          <span className="text-[7px] text-gray-400 font-mono">Photo ID</span>
        </div>

        <div className="flex-1 min-w-0">
          <span className="inline-block font-mono text-[10px] font-bold text-[#E9C46A] bg-black/40 px-2 py-0.5 rounded-md mb-1 border border-[#D4AF37]/30">
            {student.code}
          </span>
          <h3 className="text-sm font-black text-white leading-tight truncate">
            {student.name}
          </h3>
          <p className="text-[10px] text-emerald-200 font-medium truncate mt-0.5">
            {student.track}
          </p>

          <div className="grid grid-cols-2 gap-1.5 mt-2 text-[9px]">
            <div className="bg-black/30 p-1 rounded-lg border border-white/5">
              <span className="text-gray-400 block text-[8px]">Current Level</span>
              <span className="font-black text-[#E9C46A]">Juz {student.juzLevel} / 30</span>
            </div>
            <div className="bg-black/30 p-1 rounded-lg border border-white/5">
              <span className="text-gray-400 block text-[8px]">Blood Group</span>
              <span className="font-bold text-white">{student.bloodGroup || 'O+'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-black/40 rounded-xl p-2.5 border border-[#D4AF37]/20 space-y-1 text-[9px] my-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Assigned Halaqah:</span>
          <span className="font-bold text-emerald-200 truncate max-w-[170px]">{student.halaqahGroup}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Guardian / Contact:</span>
          <span className="font-bold text-white truncate max-w-[170px]">{student.guardianName} ({student.guardianPhone})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status & Attendance:</span>
          <span className="font-black text-emerald-400">{student.status} • {student.dailyAttendance}% Rate</span>
        </div>
      </div>

      {/* Barcode & Security Strip */}
      <div className="pt-2 border-t border-[#D4AF37]/30 flex items-center justify-between">
        <div className="space-y-0.5">
          {/* Simulated Barcode */}
          <div className="h-6 flex items-center gap-[2px] bg-white px-2 py-1 rounded">
            {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
              <div 
                key={i} 
                className="bg-gray-950 h-full" 
                style={{ width: `${w}px` }} 
              />
            ))}
          </div>
          <span className="text-[7.5px] font-mono text-gray-400 tracking-widest block text-center">
            *{student.code.replace(/[^A-Z0-9]/g, '')}*
          </span>
        </div>

        <div className="text-right">
          <div className="text-[8px] text-emerald-300 font-bold flex items-center justify-end gap-1">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>Verified Institutional Pass</span>
          </div>
          <span className="text-[7px] text-gray-400 block mt-0.5">Office of the Registrar • Chiro</span>
        </div>
      </div>
    </div>
  );
};
