import React, { useState } from 'react';
import { AdmissionApplication } from '../types';
import { GraduationCap, X, CheckCircle2, ChevronDown } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../data/initialData';

interface PublicAdmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: Omit<AdmissionApplication, 'id' | 'submissionDate' | 'status'>) => void;
}

export const PublicAdmissionsModal: React.FC<PublicAdmissionsModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [age, setAge] = useState<number>(11);
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('+2519');
  const [address, setAddress] = useState('Chiro Town, West Hararghe');
  const [track, setTrack] = useState('Full-time Hifz (Boarding)');
  const [priorJuz, setPriorJuz] = useState<number>(2);
  const [paymentChannel, setPaymentChannel] = useState('Telebirr');
  const [notes, setNotes] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !guardianName.trim() || !phone.trim()) return;

    onSubmit({
      fullName: fullName.trim(),
      gender,
      age: Number(age),
      guardianName: guardianName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      track,
      priorJuz: Number(priorJuz),
      paymentChannel,
      notes: notes.trim() || undefined
    });

    setSubmittedId(`ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Student Admission Application
              </h3>
              <p className="text-xs text-gray-500">
                Enroll for Academic Year 2018 / 2019 E.C. (Chiro Campus)
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

        {submittedId ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-gray-900">
              Application Successfully Submitted!
            </h4>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Your application tracking reference is <strong className="font-mono text-[#0F5132]">{submittedId}</strong>.
              Our registrar will contact the guardian for oral assessment scheduling.
            </p>
            <button
              onClick={() => {
                setSubmittedId(null);
                onClose();
              }}
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Applicant Full Name:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Yusuf Ibrahim Taha"
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
                  min="6"
                  max="22"
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
                  Prior Juz (0-30):
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={priorJuz}
                  onChange={(e) => setPriorJuz(Number(e.target.value))}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Target Track:
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Full-time Hifz (Boarding)">Full-time Hifz (Boarding)</option>
                  <option value="Full-time Hifz (Day Student)">Full-time Hifz (Day Student)</option>
                  <option value="Weekend & Evening Halaqah">Weekend & Evening Halaqah</option>
                  <option value="Primary Foundation (Juz Amma)">Primary Foundation (Juz Amma)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Tuition Channel:
                </label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Telebirr">Telebirr (800 ETB/mo)</option>
                  <option value="CBE Bank Transfer">CBE Bank Transfer</option>
                  <option value="Kafalat al-Yateem (Orphan Need)">Kafalat al-Yateem (Orphan Need)</option>
                  <option value="Cash at Office">Cash at Office</option>
                </select>
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
                  placeholder="e.g. Ibrahim Taha"
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Guardian Contact Phone:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Residential Address in Chiro / Zone:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Chiro Kebele 02 near Grand Mosque"
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-6 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Submit Admission Application</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
