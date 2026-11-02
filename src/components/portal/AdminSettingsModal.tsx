import React, { useState } from 'react';
import { InstitutionSettings } from '../../types';
import { Settings, X, Save, CheckCircle2, ShieldCheck, Phone, Video, Send, MessageCircle } from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../../data/initialData';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InstitutionSettings;
  onSaveSettings: (settings: InstitutionSettings) => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<InstitutionSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F5132] text-white flex items-center justify-center shadow-md border border-[#D4AF37]">
              <Settings className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-gray-900">
                  Institution & System Settings
                </h3>
                <span className="bg-emerald-100 text-[#0F5132] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Admin & Owner Console
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Easily modify social links, contact numbers, banking accounts, and tuition rates
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

        <form onSubmit={handleSubmit} className="space-y-5 my-4">
          
          {/* Section 1: Institution Names & Branding */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
            <span className="text-xs font-black text-gray-800 uppercase tracking-wider block">
              1. Institution Identity & Names
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  English Formal Title:
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full text-xs font-bold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">
                  Arabic Formal Title (العربية):
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full text-xs font-arabic font-bold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F5132]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-600 block mb-1">
                Campus Location / Address:
              </label>
              <input
                type="text"
                value={formData.locationEn}
                onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                className="w-full text-xs font-bold bg-white border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F5132]"
                required
              />
            </div>
          </div>

          {/* Section 2: Social Media & Direct Messaging */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
            <span className="text-xs font-black text-[#0F5132] uppercase tracking-wider block">
              2. Official Contacts & Social Channels
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Helpline & WhatsApp Phone:</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    const phone = e.target.value;
                    setFormData({ 
                      ...formData, 
                      phone,
                      whatsappUrl: `https://wa.me/${phone.replace(/[^0-9]/g, '')}`,
                      telegramUrl: `https://t.me/${phone.replace(/[\s-]/g, '')}`
                    });
                  }}
                  className="w-full text-xs font-mono font-bold bg-white border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Direct URL:</span>
                </label>
                <input
                  type="text"
                  value={formData.whatsappUrl}
                  onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                  className="w-full text-xs font-mono bg-white border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                  <span>Telegram Link:</span>
                </label>
                <input
                  type="text"
                  value={formData.telegramUrl}
                  onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                  className="w-full text-xs font-mono bg-white border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <Video className="w-3.5 h-3.5 text-red-600" />
                  <span>YouTube Channel:</span>
                </label>
                <input
                  type="text"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full text-xs font-mono bg-white border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5 mb-1">
                  <span>🎵</span>
                  <span>TikTok Profile:</span>
                </label>
                <input
                  type="text"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  className="w-full text-xs font-mono bg-white border border-emerald-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Treasury, Accounts & Rates */}
          <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wider block">
              3. Banking Accounts & Financial Parameters
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  CBE Bank Account:
                </label>
                <input
                  type="text"
                  value={formData.cbeAccount}
                  onChange={(e) => setFormData({ ...formData, cbeAccount: e.target.value })}
                  className="w-full text-xs font-mono font-bold bg-white border border-purple-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Awash Bank Account:
                </label>
                <input
                  type="text"
                  value={formData.awashAccount}
                  onChange={(e) => setFormData({ ...formData, awashAccount: e.target.value })}
                  className="w-full text-xs font-mono font-bold bg-white border border-purple-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Telebirr Number:
                </label>
                <input
                  type="text"
                  value={formData.telebirrAccount}
                  onChange={(e) => setFormData({ ...formData, telebirrAccount: e.target.value })}
                  className="w-full text-xs font-mono font-bold bg-white border border-purple-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Standard Monthly Tuition Fee (ETB):
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={formData.tuitionFeeETB}
                  onChange={(e) => setFormData({ ...formData, tuitionFeeETB: Number(e.target.value) })}
                  className="w-full text-xs font-bold bg-white border border-purple-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Vision 2030 Campaign Target (ETB):
                </label>
                <input
                  type="number"
                  min="1000000"
                  step="100000"
                  value={formData.vision2030TargetETB}
                  onChange={(e) => setFormData({ ...formData, vision2030TargetETB: Number(e.target.value) })}
                  className="w-full text-xs font-bold bg-white border border-purple-300 rounded-xl px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-6 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>Save & Apply Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
