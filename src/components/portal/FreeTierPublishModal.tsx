import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Server, 
  Database, 
  FileSpreadsheet,
  Globe,
  Terminal,
  Zap
} from 'lucide-react';

interface FreeTierPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
  firestoreDatabaseId?: string;
}

export const FreeTierPublishModal: React.FC<FreeTierPublishModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  firestoreDatabaseId = 'ai-studio-alfurqanacademyh-679139b6-20b8-4372-b841-dec5efc2e8f0'
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    if (onShowToast) onShowToast('Command copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden animate-fadeIn my-8">
        
        {/* Header */}
        <div className="bg-[#0A3622] p-6 text-white border-b-2 border-[#D4AF37] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-[#D4AF37]/50 text-[#D4AF37]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">Free Tier & Standalone Publishing Guide</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Zero Paid APIs
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Run Markazul Furqan outside AI Studio with 100% free cloud hosting and database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-2 rounded-xl hover:bg-emerald-900/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-gray-800">
          
          {/* Free Tier Architecture Guarantee */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0F5132] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-[#0F5132] uppercase tracking-wider">
                Confirmed: 100% Free-Tier Architecture
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                This application has been updated to remove all paid API key constraints. It is built as a pure, responsive client-side SPA with real-time Firebase Firestore cloud persistence and Google Sheets data analytics—all running within Google Cloud & Firebase Free Spark Tier quotas.
              </p>
            </div>
          </div>

          {/* Cloud Resources Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-gray-900 mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Firestore Cloud Database</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Connected: <code className="bg-white px-1 py-0.5 rounded border text-[10px] text-emerald-800 font-mono break-all">{firestoreDatabaseId}</code>
              </p>
              <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-1 rounded-lg">
                ✓ Free Spark Tier: 1 GB storage, 50,000 reads/day, 20,000 writes/day free forever.
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-gray-900 mb-1">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Google Sheets Integration</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Direct OAuth 2.0 integration for live institution data analysis and cloud backup spreadsheets.
              </p>
              <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-2 py-1 rounded-lg">
                ✓ Free Google Workspace API quota: 100% free for institutional management.
              </div>
            </div>
          </div>

          {/* Hosting Deployment Options */}
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0F5132]" />
              <span>How To Publish Anywhere For Free</span>
            </h4>

            {/* Option 1: Firebase Hosting */}
            <div className="border border-gray-200 rounded-2xl p-4 mb-3 hover:border-emerald-300 transition">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Option 1: Firebase Hosting (Recommended)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                  10 GB Transfer/mo Free
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Deploy directly to your connected Firebase project with standard static build:
              </p>
              <div className="bg-gray-900 text-gray-100 font-mono text-[11px] p-3 rounded-xl flex items-center justify-between">
                <span>npm run build && npx firebase-tools deploy --only hosting</span>
                <button
                  onClick={() => handleCopy('npm run build && npx firebase-tools deploy --only hosting', 1)}
                  className="text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
                  title="Copy command"
                >
                  {copiedIndex === 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Option 2: Vercel */}
            <div className="border border-gray-200 rounded-2xl p-4 mb-3 hover:border-emerald-300 transition">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Option 2: Vercel Free Hobby Tier
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-full">
                  Instant Git Deploy Free
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Push your code to GitHub and import into Vercel, or run via CLI:
              </p>
              <div className="bg-gray-900 text-gray-100 font-mono text-[11px] p-3 rounded-xl flex items-center justify-between">
                <span>npx vercel --prod</span>
                <button
                  onClick={() => handleCopy('npx vercel --prod', 2)}
                  className="text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
                  title="Copy command"
                >
                  {copiedIndex === 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Option 3: Netlify or GitHub Pages */}
            <div className="border border-gray-200 rounded-2xl p-4 hover:border-emerald-300 transition">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Option 3: Netlify / GitHub Pages
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">
                  Zero Server Costs
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Build the pure static bundle (`dist` folder) and publish:
              </p>
              <div className="bg-gray-900 text-gray-100 font-mono text-[11px] p-3 rounded-xl flex items-center justify-between">
                <span>npm run build && npx netlify-cli deploy --prod --dir=dist</span>
                <button
                  onClick={() => handleCopy('npm run build && npx netlify-cli deploy --prod --dir=dist', 3)}
                  className="text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
                  title="Copy command"
                >
                  {copiedIndex === 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Offline & Standalone Independence */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 space-y-1.5">
            <div className="font-black text-amber-950 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Offline-First Reliability in Chiro & Low-Bandwidth Regions</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              In addition to real-time cloud sync, the app maintains an automatic local storage mirror. Mu'allimeen can evaluate Sabaq, record attendance, and print report cards even during internet drops; updates automatically sync to the cloud once connectivity resumes.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            Got It, Close
          </button>
        </div>

      </div>
    </div>
  );
};
