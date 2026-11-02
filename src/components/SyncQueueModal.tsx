import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  Lock,
  X,
  AlertTriangle,
  GitMerge,
} from 'lucide-react';

interface SyncQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncQueueModal: React.FC<SyncQueueModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    useEasternNumerals,
    isOffline,
    toggleOffline,
    syncQueue,
    syncAllPending,
    isSyncing,
    attendanceEvents,
  } = useAppStore();

  const t = translations[language];

  // Conflict state demonstration
  const [conflictResolved, setConflictResolved] = useState(false);
  const [chosenResolution, setChosenResolution] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 select-none">
      <div className="w-full max-w-md bg-[#0F141C] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar">
        {/* Grab bar */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <CloudOff className="w-5 h-5 text-amber-400" />
            ) : (
              <Cloud className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <h3 className="text-base font-bold font-display uppercase tracking-wide text-slate-100">
                {t.syncQueueTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {syncQueue.length} cryptographically signed records waiting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Offline Mode Switcher Banner */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between mb-4">
          <div className="text-xs">
            <span className="font-bold text-slate-200 block">
              Network Connection Status
            </span>
            <span className="text-[11px] text-slate-400">
              {isOffline ? 'OFFLINE (Local Queue)' : 'ONLINE (Direct Cloud Sync)'}
            </span>
          </div>

          <button
            onClick={toggleOffline}
            className={`px-3 py-1.5 rounded-xl font-mono-telemetry text-xs font-bold transition-all ${
              isOffline
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isOffline ? 'Go Online' : 'Go Offline'}
          </button>
        </div>

        {/* Pending Sync Items */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-telemetry uppercase text-slate-400">
              Queued Attendance Records
            </span>
            {syncQueue.length > 0 && !isOffline && (
              <button
                onClick={() => syncAllPending()}
                disabled={isSyncing}
                className="text-xs font-mono-telemetry text-amber-400 hover:underline flex items-center gap-1"
              >
                {isSyncing && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>{t.syncAllNow}</span>
              </button>
            )}
          </div>

          {syncQueue.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-emerald-300">
                {t.allSynced}
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-0.5">
                All device events verified with operations room
              </p>
            </div>
          ) : (
            syncQueue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 text-xs font-mono-telemetry space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.deviceTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Site: {item.siteName}</span>
                  <span className="text-amber-300/80">WAITING SYNC</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 pt-1 border-t border-white/5">
                  <Lock className="w-3 h-3" />
                  <span>Sig: {item.signatureHash}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Conflict Resolution Simulator Demonstration */}
        <div className="p-4 rounded-2xl bg-[#14120D] border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <GitMerge className="w-4 h-4 text-amber-400" />
            <span>Shift Conflict Simulator (Offline vs Server)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Scenario: Supervisor adjusted shift end to 06:45 while guard was in basement dead-zone (checked out at 07:05).
          </p>

          {!conflictResolved ? (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                onClick={() => {
                  setConflictResolved(true);
                  setChosenResolution('Device (07:05)');
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono-telemetry font-bold text-slate-200 border border-white/10"
              >
                Keep Device
              </button>
              <button
                onClick={() => {
                  setConflictResolved(true);
                  setChosenResolution('Server (06:45)');
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-mono-telemetry font-bold text-slate-200 border border-white/10"
              >
                Keep Server
              </button>
              <button
                onClick={() => {
                  setConflictResolved(true);
                  setChosenResolution('Merged (Supervisor Note Attached)');
                }}
                className="p-2 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-mono-telemetry font-bold"
              >
                Merge Log
              </button>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono-telemetry text-emerald-300">
              Resolved: {chosenResolution} ✓
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
