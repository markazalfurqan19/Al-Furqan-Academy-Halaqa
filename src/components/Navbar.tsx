import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { UserSession, CloudConfig } from '../types';
import { OFFICIAL_LOGO_URL } from '../data/initialData';
import { 
  OFFICIAL_PHONE, 
  OFFICIAL_WHATSAPP_URL, 
  OFFICIAL_TELEGRAM_URL, 
  OFFICIAL_YOUTUBE_URL, 
  OFFICIAL_TIKTOK_URL 
} from '../utils/messaging';
import { 
  ShieldCheck, 
  FileSpreadsheet, 
  LogOut, 
  User as UserIcon, 
  LogIn, 
  Layers, 
  Menu, 
  X,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Send,
  Video,
  Share2,
  Settings
} from 'lucide-react';
import { InstitutionSettings } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  cloudConfig: CloudConfig;
  onOpenGoogleSheets: () => void;
  currentView: 'PUBLIC' | 'PORTAL';
  onToggleView: (view: 'PUBLIC' | 'PORTAL') => void;
  onOpenAdmissions: () => void;
  onOpenDonate: () => void;
  institutionSettings?: InstitutionSettings;
  onOpenAdminSettings?: () => void;
  cloudSyncStatus?: 'SYNCED' | 'SYNCING' | 'OFFLINE';
  onOpenPublishGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogin,
  onLogout,
  cloudConfig,
  onOpenGoogleSheets,
  currentView,
  onToggleView,
  onOpenAdmissions,
  onOpenDonate,
  institutionSettings,
  onOpenAdminSettings,
  cloudSyncStatus = 'SYNCED',
  onOpenPublishGuide
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const phone = institutionSettings?.phone || OFFICIAL_PHONE;
  const whatsappUrl = institutionSettings?.whatsappUrl || OFFICIAL_WHATSAPP_URL;
  const telegramUrl = institutionSettings?.telegramUrl || OFFICIAL_TELEGRAM_URL;
  const youtubeUrl = institutionSettings?.youtubeUrl || OFFICIAL_YOUTUBE_URL;
  const tiktokUrl = institutionSettings?.tiktokUrl || OFFICIAL_TIKTOK_URL;

  return (
    <nav className="bg-[#0A3622] text-white border-b-2 border-[#D4AF37] sticky top-0 z-40 shadow-md">
      {/* Top Announcement & Social Strip */}
      <div className="bg-[#062416] py-1 px-4 sm:px-8 border-b border-emerald-900/60 text-[11px] flex flex-wrap justify-between items-center text-emerald-200">
        <div className="flex items-center gap-3">
          <span>📞 Contact & Admissions: <strong className="text-white font-mono">{phone}</strong></span>
          <span className="hidden md:inline text-emerald-600">•</span>
          <span className="hidden md:inline">Chiro, West Hararghe, Ethiopia</span>
        </div>

        {/* Quick Social Icons */}
        <div className="flex items-center gap-4 font-bold">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#25D366] transition flex items-center gap-1"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#229ED9] transition flex items-center gap-1"
            title="Join on Telegram"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9]" />
            <span className="hidden sm:inline">Telegram</span>
          </a>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF0000] transition flex items-center gap-1"
            title="Official YouTube Channel"
          >
            <Video className="w-3.5 h-3.5 text-[#FF0000]" />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition flex items-center gap-1"
            title="Follow on TikTok"
          >
            <span className="text-xs">🎵</span>
            <span className="hidden sm:inline">TikTok</span>
          </a>

          {onOpenAdminSettings && (
            <button
              onClick={onOpenAdminSettings}
              className="text-[#D4AF37] hover:text-[#E9C46A] transition flex items-center gap-1 cursor-pointer ml-1 pl-2 border-l border-emerald-800"
              title="Admin & Owner Settings"
            >
              <Settings className="w-3 h-3" />
              <span className="hidden sm:inline font-mono">Settings</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Institution Branding */}
          <div 
            onClick={() => onToggleView('PUBLIC')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-white p-0.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <img 
                src={OFFICIAL_LOGO_URL} 
                alt="Markazul Furqan Emblem" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-[#E9C46A] transition">
                  Markazul Furqan
                </span>
                <span className="hidden sm:inline-block bg-[#D4AF37] text-gray-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Chiro
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-medium">
                Quranic & Academic Institution • Ethiopia
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold">
            <button
              onClick={() => onToggleView('PUBLIC')}
              className={`transition hover:text-[#E9C46A] cursor-pointer ${
                currentView === 'PUBLIC' ? 'text-[#E9C46A] border-b-2 border-[#E9C46A] pb-1' : 'text-gray-200'
              }`}
            >
              Overview & Halaqat
            </button>

            <button
              onClick={onOpenAdmissions}
              className="text-gray-200 hover:text-[#E9C46A] transition cursor-pointer"
            >
              Admissions 2018/19
            </button>

            <button
              onClick={onOpenDonate}
              className="text-gray-200 hover:text-[#E9C46A] transition cursor-pointer"
            >
              Vision 2030 Campaign
            </button>

            <button
              onClick={() => onToggleView('PORTAL')}
              className={`transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer ${
                currentView === 'PORTAL'
                  ? 'bg-emerald-900 text-[#E9C46A] border border-[#D4AF37]'
                  : 'bg-emerald-950/60 text-emerald-200 hover:text-white border border-emerald-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Academic Ledger Portal</span>
            </button>
          </div>

          {/* Right Action: Free Tier Cloud Status, Publish Guide, Google Sheets, Google Sign In */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Free Tier Cloud Status Pill */}
            <div 
              onClick={onOpenPublishGuide}
              className="hidden md:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-emerald-500/60 bg-emerald-950/70 text-emerald-200 cursor-pointer hover:bg-emerald-900/60 transition"
              title="Firebase Free Tier (Spark Plan) Cloud Storage Active. Click for publishing details."
            >
              <span className={`w-2 h-2 rounded-full ${cloudSyncStatus === 'SYNCED' ? 'bg-emerald-400 animate-pulse' : cloudSyncStatus === 'SYNCING' ? 'bg-amber-400 animate-ping' : 'bg-gray-400'}`}></span>
              <span>Cloud Storage Active</span>
            </div>

            {/* Free-Tier Standalone Publish Guide Button */}
            {onOpenPublishGuide && (
              <button
                onClick={onOpenPublishGuide}
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#E9C46A] hover:bg-[#D4AF37]/25 transition cursor-pointer"
                title="Publish outside Gemini / AI Studio on Free Tier"
              >
                <span>Publish Free</span>
              </button>
            )}

            {/* Google Sheets Status Pill */}
            <button
              onClick={onOpenGoogleSheets}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                cloudConfig.connectedSpreadsheetId
                  ? 'bg-emerald-900/80 text-emerald-100 border-emerald-500 hover:bg-emerald-800'
                  : 'bg-amber-950/60 text-amber-200 border-amber-600/60 hover:bg-amber-900/60'
              }`}
              title="Google Sheets Live Connection"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>{cloudConfig.connectedSpreadsheetId ? 'Sheets Connected' : 'Google Sheets'}</span>
            </button>

            {/* Official Google Sign In Button or User Avatar */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-[#0F5132] hover:bg-[#145A32] border border-[#D4AF37] px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="w-7 h-7 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-gray-950 font-bold flex items-center justify-center text-xs">
                      {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-black text-white leading-tight truncate max-w-[120px]">
                      {currentUser.displayName || 'Authorized User'}
                    </div>
                    <div className="text-[9px] text-emerald-300 font-mono truncate max-w-[120px]">
                      {currentUser.email}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 text-gray-800 z-50 animate-fadeIn">
                    <div className="border-b border-gray-100 pb-2 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Logged in with Google Account
                      </span>
                      <div className="font-extrabold text-xs text-gray-900 mt-0.5">
                        {currentUser.displayName || 'Faculty Member'}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 truncate">
                        {currentUser.email}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onToggleView('PORTAL');
                        }}
                        className="w-full text-left text-xs font-bold px-3 py-2 rounded-xl hover:bg-emerald-50 text-[#0F5132] transition flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Academic Ledger Portal</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenGoogleSheets();
                        }}
                        className="w-full text-left text-xs font-bold px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-700 transition flex items-center gap-2 cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Google Sheets Settings</span>
                      </button>

                      {onOpenAdminSettings && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onOpenAdminSettings();
                          }}
                          className="w-full text-left text-xs font-bold px-3 py-2 rounded-xl hover:bg-amber-50 text-amber-800 transition flex items-center gap-2 cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-amber-600" />
                          <span>Institution Settings (Admin)</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Official "Sign in with Google" Button */
              <button
                onClick={onLogin}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-gray-300 shadow-sm transition active:scale-95 cursor-pointer"
                title="Sign in with Google Account to connect Google Sheets"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-900 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-emerald-800 space-y-2 animate-fadeIn text-xs font-bold">
            <button
              onClick={() => {
                onToggleView('PUBLIC');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-900 text-gray-100"
            >
              Overview & Halaqat
            </button>
            <button
              onClick={() => {
                onOpenAdmissions();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-900 text-gray-100"
            >
              Admissions 2018/19
            </button>
            <button
              onClick={() => {
                onOpenDonate();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-emerald-900 text-gray-100"
            >
              Vision 2030 Campaign
            </button>
            <button
              onClick={() => {
                onToggleView('PORTAL');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-emerald-900 text-[#E9C46A] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Open Academic Ledger Portal</span>
            </button>
            <button
              onClick={() => {
                onOpenGoogleSheets();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg bg-emerald-950 text-emerald-200 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Google Sheets Sync Settings</span>
            </button>

            {/* Mobile Social Links */}
            <div className="pt-3 border-t border-emerald-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <a
                href={OFFICIAL_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950 p-2 rounded-lg text-emerald-200 hover:text-white flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: {OFFICIAL_PHONE}</span>
              </a>
              <a
                href={OFFICIAL_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950 p-2 rounded-lg text-emerald-200 hover:text-white flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
                <span>Telegram: {OFFICIAL_PHONE}</span>
              </a>
              <a
                href={OFFICIAL_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950 p-2 rounded-lg text-emerald-200 hover:text-white flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>YouTube Channel</span>
              </a>
              <a
                href={OFFICIAL_TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950 p-2 rounded-lg text-emerald-200 hover:text-white flex items-center gap-2"
              >
                <span>🎵</span>
                <span>TikTok Channel</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
