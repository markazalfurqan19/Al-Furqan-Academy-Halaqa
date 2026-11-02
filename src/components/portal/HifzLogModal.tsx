import React, { useState } from 'react';
import { Student, HifzLog, HifzGrade } from '../../types';
import { BookOpen, X, CheckCircle2, ChevronDown } from 'lucide-react';

interface HifzLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  preselectedStudent: Student | null;
  onSubmit: (log: Omit<HifzLog, 'id' | 'date'>) => Promise<void>;
  currentMuallimName?: string;
}

export const HifzLogModal: React.FC<HifzLogModalProps> = ({
  isOpen,
  onClose,
  students,
  preselectedStudent,
  onSubmit,
  currentMuallimName = "Ustadh Ziyad Abdullahi"
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudent?.id || students[0]?.id || ''
  );
  const [sabaqRange, setSabaqRange] = useState('');
  const [sabqiJuz, setSabqiJuz] = useState<number>(1);
  const [manzilJuz, setManzilJuz] = useState<number>(1);
  const [grade, setGrade] = useState<HifzGrade>('MUMTAZ');
  const [muallimName, setMuallimName] = useState(currentMuallimName);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || preselectedStudent || students[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || !sabaqRange.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentCode: currentStudent.code,
        sabaqRange: sabaqRange.trim(),
        sabqiJuz: Number(sabqiJuz),
        manzilJuz: Number(manzilJuz),
        grade,
        muallimName,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Log Daily Sabaq & Recitation
              </h3>
              <p className="text-xs text-gray-500">
                Evaluate student Sabaq, Sabqi, and Manzil revisions
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

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Select Student:
            </label>
            <div className="relative">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 appearance-none focus:outline-none focus:border-[#0F5132]"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code}) - Juz {s.juzLevel}/30
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Sabaq (New Lesson Memorized Today):
            </label>
            <input
              type="text"
              value={sabaqRange}
              onChange={(e) => setSabaqRange(e.target.value)}
              placeholder="e.g. Surah Al-Furqan Ayah 21-35 (1 Page)"
              className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Sabqi (Recent Juz Revised):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={sabqiJuz}
                onChange={(e) => setSabqiJuz(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Manzil (Cumulative Cycle Juz):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={manzilJuz}
                onChange={(e) => setManzilJuz(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Recitation Evaluation Grade:
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as HifzGrade)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="MUMTAZ">Mumtaz (Flawless / Distinction)</option>
                <option value="JAYYID_JIDDAN">Jayyid Jiddan (Very Good)</option>
                <option value="JAYYID">Jayyid (Good)</option>
                <option value="MAQBOOL">Maqbool (Passing / Needs Revision)</option>
                <option value="DAEFE">Da'eef (Repeat)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Evaluating Mu'allim:
              </label>
              <input
                type="text"
                value={muallimName}
                onChange={(e) => setMuallimName(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Mu'allim Comments / Tajweed Remarks:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Excellent Ghunnah, clear Madd Asli execution"
              className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSubmitting ? 'Recording...' : 'Save Sabaq Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
