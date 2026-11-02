import React, { useState } from 'react';
import { DonationPledge } from '../types';
import { Heart, X, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../data/initialData';

interface PublicDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pledge: Omit<DonationPledge, 'id' | 'date'>) => void;
  onOpenReceipt: (pledge: DonationPledge) => void;
}

export const PublicDonationModal: React.FC<PublicDonationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onOpenReceipt
}) => {
  const [donorName, setDonorName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+2519');
  const [amountETB, setAmountETB] = useState<number>(5000);
  const [tier, setTier] = useState<DonationPledge['tier']>('Bronze Builder');
  const [channel, setChannel] = useState<DonationPledge['channel']>('Telebirr');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [purpose, setPurpose] = useState('Vision 2030 New Academic Block & Hifz Classrooms');
  const [createdPledge, setCreatedPledge] = useState<DonationPledge | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || amountETB <= 0) return;

    const newPledge: DonationPledge = {
      id: `pl-${Date.now()}`,
      donorName: donorName.trim(),
      phoneOrEmail: phoneOrEmail.trim(),
      amountETB: Number(amountETB),
      tier,
      channel,
      referenceNumber: referenceNumber.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      purpose
    };

    onSubmit(newPledge);
    setCreatedPledge(newPledge);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Vision 2030 Capital Campaign
              </h3>
              <p className="text-xs text-gray-500">
                Building & Endowment Sadaqah Jariyah Fund • Chiro
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

        {createdPledge ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#0F5132] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-gray-900">
              Jazakumullahu Khayran!
            </h4>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Your pledge of <strong>ETB {createdPledge.amountETB.toLocaleString()}</strong> has been recorded in the Vision 2030 campaign ledger.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onOpenReceipt(createdPledge);
                  onClose();
                }}
                className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#D4AF37]" />
                <span>View & Print Donation Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            {/* Quick Bank Accounts Callout */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
              <span className="font-bold text-[#0F5132] block">Direct Transfer Information:</span>
              <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] text-gray-700">
                <div>• CBE: <strong>1000 2938 4819 2</strong></div>
                <div>• Telebirr: <strong>+251 93 509 7339</strong></div>
                <div>• Awash Bank: <strong>0132 0948 1029 00</strong></div>
                <div>• Swift: <strong>AWINETAA</strong></div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Benefactor / Donor Name:
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Hajji Ahmed & Family"
                className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Contact Phone / Email:
                </label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Pledge Amount (ETB):
                </label>
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={amountETB}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAmountETB(val);
                    if (val >= 100000) setTier('Golden Pillar');
                    else if (val >= 25000) setTier('Silver Foundation');
                    else if (val >= 5000) setTier('Bronze Builder');
                    else setTier('General Sadaqah');
                  }}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Sponsorship Tier:
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as any)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Golden Pillar">Golden Pillar (100k+ ETB)</option>
                  <option value="Silver Foundation">Silver Foundation (25k - 99k ETB)</option>
                  <option value="Bronze Builder">Bronze Builder (5k - 24k ETB)</option>
                  <option value="General Sadaqah">General Sadaqah (Under 5k ETB)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Payment Channel:
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as any)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Telebirr">Telebirr Portal</option>
                  <option value="CBE Bank Transfer">CBE Bank Transfer</option>
                  <option value="Awash Bank">Awash Bank Transfer</option>
                  <option value="Cash">Cash at Treasury Office</option>
                  <option value="Zelle/Intl">International / Diaspora Wire</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Transaction / Bank Ref Number:
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. TX-9849204"
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Designated Project Purpose:
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
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
                <Heart className="w-4 h-4 text-[#D4AF37]" />
                <span>Submit Pledge & Generate Receipt</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
