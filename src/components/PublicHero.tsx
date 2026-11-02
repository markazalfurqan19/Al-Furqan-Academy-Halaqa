import React from 'react';
import { 
  BookOpen, 
  Award, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail,
  GraduationCap,
  Sparkles,
  Calendar,
  MessageCircle,
  Send,
  Video,
  ExternalLink
} from 'lucide-react';
import { OFFICIAL_LOGO_URL } from '../data/initialData';
import { Student, DonationPledge } from '../types';
import { 
  OFFICIAL_PHONE, 
  OFFICIAL_WHATSAPP_URL, 
  OFFICIAL_TELEGRAM_URL, 
  OFFICIAL_YOUTUBE_URL, 
  OFFICIAL_TIKTOK_URL 
} from '../utils/messaging';

interface PublicHeroProps {
  students: Student[];
  pledges: DonationPledge[];
  onOpenPortal: () => void;
  onOpenAdmissions: () => void;
  onOpenDonate: () => void;
  onOpenGoogleSheets: () => void;
  hasGoogleSheet: boolean;
  onOpenPublishGuide?: () => void;
}

export const PublicHero: React.FC<PublicHeroProps> = ({
  students,
  pledges,
  onOpenPortal,
  onOpenAdmissions,
  onOpenDonate,
  onOpenGoogleSheets,
  hasGoogleSheet,
  onOpenPublishGuide
}) => {
  const totalPledged = pledges.reduce((sum, p) => sum + p.amountETB, 0);
  const targetCampaign = 10000000; // 10M ETB target
  const percentPledged = Math.min(100, Math.round((totalPledged / targetCampaign) * 100));

  const halaqat = [
    {
      name: 'Halaqah Ubayy ibn Kaab',
      focus: 'Advanced Hifz & Khatm Track (Juz 20 - 30)',
      lead: "Sheikh Nuruddin Ahmed",
      badge: 'Ijaza Track',
      color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
    },
    {
      name: 'Halaqah Aisha bint Abi Bakr',
      focus: 'Full-time Girls Quranic Memorization',
      lead: "Ustadh Ziyad Abdullahi",
      badge: 'Distinction',
      color: 'border-purple-500 bg-purple-50/70 text-purple-900'
    },
    {
      name: 'Halaqah Zayd ibn Thabit',
      focus: 'Intermediate Hifz & Mutashabihat Review (Juz 10 - 20)',
      lead: "Ustadh Dawud Yusuf",
      badge: 'Intermediate',
      color: 'border-blue-500 bg-blue-50/70 text-blue-900'
    },
    {
      name: 'Halaqah Khadijah',
      focus: 'Foundational Recitation & Juz Amma Mastery',
      lead: "Mu'allimah Fatimah",
      badge: 'Foundation',
      color: 'border-amber-500 bg-amber-50/70 text-amber-900'
    },
    {
      name: 'Halaqah Ali ibn Abi Talib',
      focus: 'Makharij al-Huruf & Ahkam at-Tajweed Evening Sessions',
      lead: "Ustadh Bilal Jibril",
      badge: 'Tajweed Core',
      color: 'border-teal-500 bg-teal-50/70 text-teal-900'
    }
  ];

  return (
    <div className="space-y-16 py-6 sm:py-10 animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A3622] via-[#0F5132] to-[#082819] text-white p-6 sm:p-12 border-2 border-[#D4AF37] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#E9C46A] backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-[#E9C46A]" />
            <span>Markazul Furqan • Chiro, West Hararghe, Ethiopia</span>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full p-1 bg-white border-2 border-[#D4AF37] shadow-xl">
            <img 
              src={OFFICIAL_LOGO_URL} 
              alt="Markazul Furqan Emblem" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-serif leading-tight">
            Nurturing the Carriers of the Holy Quran in Chiro
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Markazul Furqan Quranic & Academic Institution delivers world-class Hifz memorization, verified Tajweed certification, and moral excellence. Built with transparent records simply connected to Google Sheets.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenPortal}
              className="bg-[#D4AF37] hover:bg-[#E9C46A] text-gray-950 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-gray-950" />
              <span>Launch Academic Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGoogleSheets}
              className="bg-emerald-800 hover:bg-emerald-900 border border-emerald-400 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition shadow flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>{hasGoogleSheet ? 'Google Sheets Live' : 'Connect Google Sheet'}</span>
            </button>

            <button
              onClick={onOpenAdmissions}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>Apply for Admission</span>
            </button>
          </div>

          {/* Key Quick Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-emerald-800/80 text-left">
            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Enrolled Haffaz</span>
              <span className="text-xl font-black text-white">{students.length} Students</span>
              <span className="text-[9px] text-gray-300 block">Across 5 Halaqat</span>
            </div>

            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Memorization Goal</span>
              <span className="text-xl font-black text-[#E9C46A]">30 Complete Juz</span>
              <span className="text-[9px] text-gray-300 block">Hafs & Nafi Recitations</span>
            </div>

            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Google Sheets Sync</span>
              <span className="text-xl font-black text-emerald-400">1-Click Live</span>
              <span className="text-[9px] text-gray-300 block">Spreadsheet Integration</span>
            </div>

            <div className="bg-black/30 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Campus Location</span>
              <span className="text-xl font-black text-white">Chiro Town</span>
              <span className="text-[9px] text-gray-300 block">West Hararghe • Ethiopia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL SOCIAL & COMMUNITY CHANNELS HUB */}
      <section className="bg-gradient-to-r from-emerald-900 via-[#0F5132] to-[#0A3622] rounded-3xl p-6 sm:p-8 text-white border-2 border-[#D4AF37] shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-emerald-700/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D4AF37] text-gray-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Connect With Us
              </span>
              <h3 className="text-xl font-black text-white">
                Official Media & Instant Communication Channels
              </h3>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              Direct access to Markazul Furqan lectures, student recitations, Khatm ceremonies, and immediate messaging.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-black/40 px-3.5 py-2 rounded-xl border border-[#D4AF37]/40 text-[#E9C46A]">
            <span>Helpline:</span>
            <span>{OFFICIAL_PHONE}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* WhatsApp Card */}
          <a
            href={OFFICIAL_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-[#25D366]/20 border border-white/20 hover:border-[#25D366] p-4 rounded-2xl transition shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-white">WhatsApp Official</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5 font-mono">{OFFICIAL_PHONE}</p>
              <p className="text-[10px] text-gray-300 mt-2">
                Instant inquiry for admissions, daily Sabaq reports, and guardian communication.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#25D366]">
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Telegram Card */}
          <a
            href={OFFICIAL_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-[#229ED9]/20 border border-white/20 hover:border-[#229ED9] p-4 rounded-2xl transition shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-white">Telegram Channel</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5 font-mono">{OFFICIAL_PHONE}</p>
              <p className="text-[10px] text-gray-300 mt-2">
                Direct community channel for official circulars, exam results, and Halqah updates.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#229ED9]">
              <span>Open in Telegram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* YouTube Card */}
          <a
            href={OFFICIAL_YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-[#FF0000]/20 border border-white/20 hover:border-[#FF0000] p-4 rounded-2xl transition shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF0000]/20 text-[#FF0000] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-white">YouTube Channel</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5 truncate">@kadirhamzasiyum</p>
              <p className="text-[10px] text-gray-300 mt-2">
                Student Tilawat recitations, Khatm celebrations, Tajweed lectures, and Halaqah streams.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-red-400">
              <span>Subscribe on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* TikTok Card */}
          <a
            href={OFFICIAL_TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white p-4 rounded-2xl transition shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-black/40 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-lg">
                🎵
              </div>
              <h4 className="text-sm font-black text-white">TikTok Channel</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5 truncate">@markazulfurqaan44</p>
              <p className="text-[10px] text-gray-300 mt-2">
                Daily Quranic reminders, student achievements, and campus highlights in Chiro.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-gray-200">
              <span>Follow on TikTok</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </section>

      {/* 3. THE 5 CHIRO HALAQAT CURRICULUM */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-[#0F5132] uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
            Structured Halaqat
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Academic & Quranic Learning Halaqat
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Each student is placed into a tailored recitation halaqah led by certified Mu'allimeen, adhering to classical Sanad chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {halaqat.map((h, idx) => (
            <div 
              key={idx}
              className={`p-5 rounded-3xl border-2 shadow-xs transition hover:shadow-md ${h.color}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-black text-sm tracking-tight">{h.name}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                  {h.badge}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90 mb-4">
                {h.focus}
              </p>
              <div className="pt-3 border-t border-current/10 flex items-center justify-between text-[11px] font-bold">
                <span>Faculty: {h.lead}</span>
                <span className="text-[10px] uppercase tracking-wider">Daily Session</span>
              </div>
            </div>
          ))}

          {/* Quick Info Tile */}
          <div className="p-5 rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                Daily Halaqah Rhythm
              </span>
              <ul className="text-xs text-gray-600 space-y-1.5 mt-2">
                <li>• <strong>Fajr:</strong> Sabaq presentation (New Lesson)</li>
                <li>• <strong>Duhr:</strong> Sabqi evaluation (Recent Portions)</li>
                <li>• <strong>Asr:</strong> Manzil cumulative review cycle</li>
                <li>• <strong>Maghrib:</strong> Ahkam at-Tajweed theory</li>
              </ul>
            </div>
            <button
              onClick={onOpenPortal}
              className="mt-4 text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1"
            >
              <span>Explore Student Velocity Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. VISION 2030 CAPITAL CAMPAIGN SECTION */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Sadaqah Jariyah
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Vision 2030: Chiro Campus Expansion Fund
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Building modern boarding dormitories, specialized Hifz classrooms, solar power, and clean water wells.
            </p>
          </div>

          <button
            onClick={onOpenDonate}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs sm:text-sm font-black px-6 py-3 rounded-2xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>Make a Pledge / Donate</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase">Pledged so far</span>
              <div className="text-2xl font-black text-[#0F5132]">
                ETB {totalPledged.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-bold uppercase">Target Goal</span>
              <div className="text-base font-black text-gray-800">
                ETB {targetCampaign.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#0F5132] to-[#D4AF37] h-3.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(8, percentPledged)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
            <span>{percentPledged}% of Phase 1 Funded</span>
            <span>Telebirr • Commercial Bank of Ethiopia (CBE) • Awash Bank</span>
          </div>
        </div>

        {/* Donation Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <span className="font-black text-[#0F5132] block">Telebirr Portal</span>
            <span className="font-mono text-gray-800 text-[11px] block mt-0.5">{OFFICIAL_PHONE}</span>
            <span className="text-[10px] text-gray-500">Account: Markazul Furqan Fund</span>
          </div>
          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
            <span className="font-black text-blue-900 block">Commercial Bank of Ethiopia</span>
            <span className="font-mono text-gray-800 text-[11px] block mt-0.5">1000 2938 4819 2</span>
            <span className="text-[10px] text-gray-500">Chiro Branch • Markazul Furqan</span>
          </div>
          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200">
            <span className="font-black text-purple-900 block">Awash Bank</span>
            <span className="font-mono text-gray-800 text-[11px] block mt-0.5">0132 0948 1029 00</span>
            <span className="text-[10px] text-gray-500">Swift: AWINETAA • Chiro Branch</span>
          </div>
        </div>
      </section>

      {/* 5. FOOTER & CONTACT */}
      <footer className="border-t border-gray-200 pt-8 pb-4 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={OFFICIAL_LOGO_URL} alt="Emblem" className="w-8 h-8 rounded-full border border-[#D4AF37]" />
          <div>
            <span className="font-black text-gray-800 block">Markazul Furqan Academic Ledger</span>
            <span className="text-[10px] text-gray-400">Chiro, West Hararghe, Oromia, Ethiopia</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 font-semibold">
          <a 
            href={OFFICIAL_WHATSAPP_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-[#0F5132] transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp: {OFFICIAL_PHONE}</span>
          </a>

          <a 
            href={OFFICIAL_TELEGRAM_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-[#0F5132] transition"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9]" />
            <span>Telegram: {OFFICIAL_PHONE}</span>
          </a>

          <a 
            href={OFFICIAL_YOUTUBE_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-[#0F5132] transition"
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>YouTube</span>
          </a>

          <a 
            href={OFFICIAL_TIKTOK_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-[#0F5132] transition"
          >
            <span>🎵</span>
            <span>TikTok</span>
          </a>
        </div>

        <div>
          <span>© 2018/2019 E.C. (2026 G.C.) Markazul Furqan • Free Tier Verified</span>
        </div>
      </footer>

    </div>
  );
};
