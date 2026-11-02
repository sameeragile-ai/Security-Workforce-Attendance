import React from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import {
  BellRing,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const SupervisorAlertsScreen: React.FC = () => {
  const {
    language,
    useEasternNumerals,
    sites,
    isMockLocationDetected,
    dispatchGuardToSite,
  } = useAppStore();

  const t = translations[language];

  const shortSites = sites.filter((s) => s.onDutyGuards < s.requiredGuards);

  return (
    <div className="space-y-4 pb-28 px-3.5 pt-2">
      <div>
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-100">
          Live Operational Alerts
        </h2>
        <p className="text-xs text-slate-400 font-body">
          Real-time Coverage Gaps & Telemetry Anomalies
        </p>
      </div>

      {/* Active Mock Location Breach Flag if triggered */}
      {isMockLocationDetected && (
        <div className="p-4 rounded-3xl bg-red-950/80 border border-red-500/60 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-telemetry font-bold text-red-300 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-ping" />
              <span>ACTIVE SPOOFING ALARM</span>
            </span>
            <span className="text-[10px] font-mono-telemetry text-red-400">Just now</span>
          </div>
          <p className="text-xs text-red-200 leading-relaxed font-body">
            Guard Mahmoud Abdel-Rahman (AG-4082) reported telemetry anomaly. GPS provider reported mock provider flag. Auto check-in blocked.
          </p>
        </div>
      )}

      {/* Shortage Feeds */}
      <div className="space-y-3">
        <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
          Coverage Shortages ({shortSites.length})
        </span>

        {shortSites.map((site) => {
          const short = site.requiredGuards - site.onDutyGuards;

          return (
            <div
              key={site.id}
              className="p-4 rounded-3xl bg-[#0D1219] border border-amber-500/30 shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{site.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {short} guard shortage detected since 19:12 EET
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-telemetry text-[10px] font-bold">
                  SHORT {short}
                </span>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono-telemetry text-slate-500">
                  Supervisor: {site.supervisorName}
                </span>
                <button
                  onClick={() => dispatchGuardToSite('standby_01', site.id)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-telemetry text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <Send className="w-3 h-3" />
                  <span>Dispatch Standby</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
