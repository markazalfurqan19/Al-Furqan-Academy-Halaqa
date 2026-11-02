import React, { useState } from 'react';
import { Student } from '../../types';
import { Users, X, CheckCircle2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Omit<Student, 'id' | 'dailyAttendance'>) => Promise<void>;
  nextStudentCount: number;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  nextStudentCount
}) => {
  const generatedCode = `MF-2026-${String(nextStudentCount + 1).padStart(3, '0')}`;

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(12);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [track, setTrack] = useState('Full-time Hifz (Imam Nafi)');
  const [currentSurah, setCurrentSurah] = useState('Surah Al-Baqarah');
  const [juzLevel, setJuzLevel] = useState<number>(1);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+2519');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [halaqahGroup, setHalaqahGroup] = useState('Halaqah Ubayy ibn Kaab');
  const [status, setStatus] = useState<any>('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !guardianName.trim() || !guardianPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        code: generatedCode,
        name: name.trim(),
        age: Number(age),
        gender,
        track,
        currentSurah: currentSurah.trim(),
        juzLevel: Number(juzLevel),
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim(),
        enrollmentDate: new Date().toISOString().split('T')[0],
        status,
        bloodGroup,
        halaqahGroup,
        monthlyAttendanceHistory: {}
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
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#0F5132] flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Enroll New Student Candidate
              </h3>
              <p className="text-xs text-gray-500">
                Register candidate into active Chiro Halaqah roster
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Student ID Code:
              </label>
              <input
                type="text"
                value={generatedCode}
                readOnly
                className="w-full text-xs font-mono font-bold bg-gray-100 border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="ACTIVE">Active</option>
                <option value="KHATM_TRACK">Khatm Track</option>
                <option value="REVISION">Revision</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Full Student Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ibrahim Ahmed Nur"
              className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Age:
              </label>
              <input
                type="number"
                min="5"
                max="25"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Gender:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Blood Group:
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Hifz Track:
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="Full-time Hifz (Imam Nafi)">Full-time Hifz (Imam Nafi)</option>
                <option value="Full-time Hifz (Hafs an Asim)">Full-time Hifz (Hafs an Asim)</option>
                <option value="Primary Foundation (Juz Amma)">Primary Foundation (Juz Amma)</option>
                <option value="Khatm Ijaza Track">Khatm Ijaza Track</option>
                <option value="Evening Tajweed">Evening Tajweed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Halaqah Circle:
              </label>
              <select
                value={halaqahGroup}
                onChange={(e) => setHalaqahGroup(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="Halaqah Ubayy ibn Kaab">Halaqah Ubayy ibn Kaab</option>
                <option value="Halaqah Aisha bint Abi Bakr">Halaqah Aisha bint Abi Bakr</option>
                <option value="Halaqah Zayd ibn Thabit">Halaqah Zayd ibn Thabit</option>
                <option value="Halaqah Khadijah">Halaqah Khadijah</option>
                <option value="Halaqah Ali ibn Abi Talib">Halaqah Ali ibn Abi Talib</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Current Juz Level (0-30):
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={juzLevel}
                onChange={(e) => setJuzLevel(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Current Active Surah:
              </label>
              <input
                type="text"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(e.target.value)}
                placeholder="e.g. Surah Al-Kahf"
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Guardian Full Name:
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Ahmed Nur"
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Guardian Phone:
              </label>
              <input
                type="text"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
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
              className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-950" />
              <span>{isSubmitting ? 'Enrolling...' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
