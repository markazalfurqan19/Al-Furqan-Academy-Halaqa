import React, { useState, useEffect } from 'react';
import { Student, StudentStatus } from '../../types';
import { Edit3, X, Save, CheckCircle2 } from 'lucide-react';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSaveStudent: (updated: Student) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [age, setAge] = useState<number>(12);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [track, setTrack] = useState('');
  const [currentSurah, setCurrentSurah] = useState('');
  const [juzLevel, setJuzLevel] = useState<number>(1);
  const [dailyAttendance, setDailyAttendance] = useState<number>(95);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [halaqahGroup, setHalaqahGroup] = useState('');
  const [status, setStatus] = useState<StudentStatus>('ACTIVE');

  useEffect(() => {
    if (student) {
      setName(student.name);
      setCode(student.code);
      setAge(student.age);
      setGender(student.gender);
      setTrack(student.track);
      setCurrentSurah(student.currentSurah);
      setJuzLevel(student.juzLevel);
      setDailyAttendance(student.dailyAttendance);
      setGuardianName(student.guardianName);
      setGuardianPhone(student.guardianPhone);
      setBloodGroup(student.bloodGroup || 'O+');
      setHalaqahGroup(student.halaqahGroup);
      setStatus(student.status);
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !guardianName.trim() || !guardianPhone.trim()) return;

    const updated: Student = {
      ...student,
      name: name.trim(),
      code: code.trim(),
      age: Number(age),
      gender,
      track,
      currentSurah: currentSurah.trim(),
      juzLevel: Math.min(30, Math.max(0, Number(juzLevel))),
      dailyAttendance: Math.min(100, Math.max(0, Number(dailyAttendance))),
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      bloodGroup,
      halaqahGroup,
      status
    };

    onSaveStudent(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Edit Student Academic Dossier
              </h3>
              <p className="text-xs text-gray-500">
                Admin & Faculty Quick Editing • Markazul Furqan
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs font-mono font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="ACTIVE">Active</option>
                <option value="KHATM_TRACK">Khatm Track (Ijaza)</option>
                <option value="GRADUATED">Graduated (Completed 30 Juz)</option>
                <option value="REVISION">Revision / Muraja'ah</option>
                <option value="ON_LEAVE">On Leave</option>
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
                max="30"
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
                <option value="A-">A-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Academic Track:
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              >
                <option value="Full-time Hifz (Imam Nafi)">Full-time Hifz (Imam Nafi)</option>
                <option value="Full-time Hifz (Hafs an Asim)">Full-time Hifz (Hafs an Asim)</option>
                <option value="Primary Foundation (Juz Amma)">Primary Foundation (Juz Amma)</option>
                <option value="Full-time Hifz (Khatm Track)">Full-time Hifz (Khatm Track)</option>
                <option value="Full-time Hifz (Khatm Honors)">Full-time Hifz (Khatm Honors)</option>
                <option value="Full-time Hifz (Intermediate)">Full-time Hifz (Intermediate)</option>
                <option value="Evening Tajweed">Evening Tajweed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Assigned Halaqah:
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Juz Level (0-30):
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

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Current Surah Recitation:
              </label>
              <input
                type="text"
                value={currentSurah}
                onChange={(e) => setCurrentSurah(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Attendance %:
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={dailyAttendance}
                onChange={(e) => setDailyAttendance(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Guardian Full Name:
              </label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              Guardian Phone Number (WhatsApp / SMS):
            </label>
            <input
              type="text"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
              className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
