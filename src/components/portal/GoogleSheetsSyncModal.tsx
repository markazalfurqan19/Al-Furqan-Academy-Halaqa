import React, { useState } from 'react';
import { 
  CloudConfig, 
  Student, 
  HifzLog, 
  ExamRecord, 
  TuitionRecord, 
  AdmissionApplication, 
  DonationPledge 
} from '../../types';
import { 
  createMarkazulFurqanSpreadsheet, 
  syncAllDataToGoogleSheet, 
  getSpreadsheetDetails 
} from '../../lib/sheets';
import { getAccessToken, googleSignIn } from '../../lib/firebase';
import { 
  FileSpreadsheet, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Database
} from 'lucide-react';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudConfig: CloudConfig;
  onUpdateCloudConfig: (config: CloudConfig) => void;
  data: {
    students: Student[];
    hifzLogs: HifzLog[];
    exams: ExamRecord[];
    tuition: TuitionRecord[];
    admissions: AdmissionApplication[];
    pledges: DonationPledge[];
  };
  onShowToast: (msg: string) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  cloudConfig,
  onUpdateCloudConfig,
  data,
  onShowToast
}) => {
  const [spreadsheetIdInput, setSpreadsheetIdInput] = useState(cloudConfig.connectedSpreadsheetId || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmSync, setShowConfirmSync] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract spreadsheet ID if full URL pasted
  const parseSpreadsheetId = (input: string): string => {
    const trimmed = input.trim();
    const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : trimmed;
  };

  const handleCreateNewSheet = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (!token) {
        throw new Error('Please sign in with your Google account first to create a spreadsheet.');
      }

      const result = await createMarkazulFurqanSpreadsheet(token);
      
      // Immediately populate with current records
      await syncAllDataToGoogleSheet(token, result.spreadsheetId, data);

      const updated: CloudConfig = {
        ...cloudConfig,
        connectedSpreadsheetId: result.spreadsheetId,
        connectedSpreadsheetUrl: result.spreadsheetUrl,
        connectedSpreadsheetTitle: result.title,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      onUpdateCloudConfig(updated);
      onShowToast(`New Google Sheet created and synchronized!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to create Google Sheet');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConnectExisting = async () => {
    const cleanId = parseSpreadsheetId(spreadsheetIdInput);
    if (!cleanId) {
      setErrorMsg('Please enter a valid Google Spreadsheet ID or URL');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (!token) {
        throw new Error('Please sign in with your Google account first to access spreadsheets.');
      }

      const details = await getSpreadsheetDetails(token, cleanId);
      const url = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;

      const updated: CloudConfig = {
        ...cloudConfig,
        connectedSpreadsheetId: cleanId,
        connectedSpreadsheetUrl: url,
        connectedSpreadsheetTitle: details.title,
      };

      onUpdateCloudConfig(updated);
      onShowToast(`Successfully connected to "${details.title}"!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to verify spreadsheet access.');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeSync = async () => {
    if (!cloudConfig.connectedSpreadsheetId) {
      setErrorMsg('Please create or connect a spreadsheet first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      let token = await getAccessToken();
      if (!token) {
        const signinRes = await googleSignIn();
        token = signinRes?.accessToken || null;
      }

      if (!token) {
        throw new Error('Please sign in with your Google account first to sync.');
      }

      await syncAllDataToGoogleSheet(token, cloudConfig.connectedSpreadsheetId, data);

      const updated: CloudConfig = {
        ...cloudConfig,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onUpdateCloudConfig(updated);
      setShowConfirmSync(false);
      onShowToast(`Synchronized ${data.students.length} students & ${data.hifzLogs.length} logs to Google Sheets!`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Sync failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-fadeIn my-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">
                Google Sheets Real-Time Integration
              </h3>
              <p className="text-xs text-gray-500">
                Seamless cloud synchronization with your Google Workspace account
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

        {errorMsg && (
          <div className="my-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Connection Issue:</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Current Connection Status Box */}
        <div className="my-4 p-4 rounded-2xl border bg-gray-50/80 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">Current Spreadsheet Status:</span>
            {cloudConfig.connectedSpreadsheetId ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                No Sheet Linked Yet
              </span>
            )}
          </div>

          {cloudConfig.connectedSpreadsheetId ? (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-black text-gray-900">
                {cloudConfig.connectedSpreadsheetTitle || 'Markazul Furqan Academic Ledger'}
              </div>
              <div className="font-mono text-[10px] text-gray-400 truncate">
                ID: {cloudConfig.connectedSpreadsheetId}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                <span className="text-gray-500 text-[11px]">
                  Last synced: <strong>{cloudConfig.lastSyncedAt || 'Not synced yet'}</strong>
                </span>
                <a
                  href={cloudConfig.connectedSpreadsheetUrl || `https://docs.google.com/spreadsheets/d/${cloudConfig.connectedSpreadsheetId}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 border border-emerald-200 transition"
                >
                  <span>Open in Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-2">
              Create a dedicated spreadsheet in your Google Drive or connect an existing sheet to start syncing.
            </p>
          )}
        </div>

        {/* 1-Click Create Action */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200">
            <h4 className="text-xs font-black text-[#0F5132] uppercase tracking-wider mb-1">
              Option 1: One-Click Instant Setup
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Automatically creates a new Google Spreadsheet in your Google Drive with formatted sheets for Students Roster, Sabaq Logs, Oral Exams, Tuition, and Pledges.
            </p>
            <button
              onClick={handleCreateNewSheet}
              disabled={isProcessing}
              className="w-full bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-black py-3 rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>{isProcessing ? 'Connecting...' : 'Create & Populate New Google Sheet'}</span>
            </button>
          </div>

          {/* Option 2: Connect Existing */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
              Option 2: Connect Existing Google Sheet
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Paste the Google Sheet URL or ID from your browser:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs.../edit"
                value={spreadsheetIdInput}
                onChange={(e) => setSpreadsheetIdInput(e.target.value)}
                className="flex-1 text-xs font-mono bg-white border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0F5132]"
              />
              <button
                onClick={handleConnectExisting}
                disabled={isProcessing || !spreadsheetIdInput.trim()}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
              >
                Link
              </button>
            </div>
          </div>
        </div>

        {/* Sync Confirmation Dialog (Strictly complying with Workspace integration confirmation guidelines) */}
        {showConfirmSync ? (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 animate-fadeIn">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Confirm Data Synchronization to Google Sheets</span>
            </div>
            <p className="text-xs text-amber-800 mb-3 leading-relaxed">
              This will update the <strong>Students Roster</strong>, <strong>Sabaq Logs</strong>, <strong>Oral Exams</strong>, <strong>Tuition</strong>, and <strong>Pledges</strong> sheets in your connected Google Spreadsheet with the latest records from this portal. Existing rows will be refreshed. Do you wish to proceed?
            </p>
            <div className="flex items-center justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setShowConfirmSync(false)}
                className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={executeSync}
                disabled={isProcessing}
                className="px-4 py-1.5 rounded-xl bg-[#0F5132] text-white hover:bg-[#0A3622] transition shadow flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Confirm & Sync Now</span>
              </button>
            </div>
          </div>
        ) : (
          cloudConfig.connectedSpreadsheetId && (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">
                Ready to sync <strong>{data.students.length} students</strong> & <strong>{data.hifzLogs.length} logs</strong>
              </span>
              <button
                onClick={() => setShowConfirmSync(true)}
                disabled={isProcessing}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 text-emerald-200" />
                <span>Sync Records to Google Sheet</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
