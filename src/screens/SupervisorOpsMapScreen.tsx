import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { STANDBY_GUARDS_POOL } from '../data/seed';
import {
  MapPin,
  Shield,
  Users,
  Send,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Navigation,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { BrandShieldLogo } from '../components/BrandShieldLogo';

export const SupervisorOpsMapScreen: React.FC = () => {
  const {
    brand,
    language,
    useEasternNumerals,
    sites,
    selectedSiteId,
    setSelectedSiteId,
    dispatchGuardToSite,
  } = useAppStore();

  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  const [selectedSiteDrawer, setSelectedSiteDrawer] = useState<string | null>(null);
  const activeDrawerSite = sites.find((s) => s.id === selectedSiteDrawer);

  const optimalCount = sites.filter((s) => s.status === 'optimal').length;
  const warningCount = sites.filter((s) => s.status === 'warning').length;
  const criticalCount = sites.filter((s) => s.status === 'critical').length;
  const totalOnDuty = sites.reduce((sum, s) => sum + s.onDutyGuards, 0);
  const totalRequired = sites.reduce((sum, s) => sum + s.requiredGuards, 0);

  return (
    <div className="space-y-4 pb-28 px-3.5 pt-2">
      {/* Ops Command Summary Header */}
      <div className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold font-display uppercase tracking-wider text-slate-100">
              {t.opsMapTitle}
            </h2>
          </div>
          <span className="text-[10px] font-mono-telemetry text-slate-400">
            {formatNumber(sites.length, language, useEasternNumerals)} SITES MONITORED
          </span>
        </div>

        {/* 3-Part Coverage KPI Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono-telemetry pt-2 border-t border-white/5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400 uppercase block">Optimal</span>
            <span className="text-base font-bold text-emerald-300">
              {formatNumber(optimalCount, language, useEasternNumerals)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] text-amber-400 uppercase block">Shortage</span>
            <span className="text-base font-bold text-amber-300">
              {formatNumber(warningCount, language, useEasternNumerals)}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="text-[10px] text-red-400 uppercase block">Critical</span>
            <span className="text-base font-bold text-red-300">
              {formatNumber(criticalCount, language, useEasternNumerals)}
            </span>
          </div>
        </div>

        {/* Overall Force Headcount Bar */}
        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-mono-telemetry text-slate-400">
          <span>Active Guard Deployment:</span>
          <span className="text-slate-200 font-bold">
            {formatNumber(totalOnDuty, language, useEasternNumerals)} / {formatNumber(totalRequired, language, useEasternNumerals)} guards
          </span>
        </div>
      </div>

      {/* Cairo / Giza Tactical Vector Map Viewport */}
      <div className="relative w-full h-72 rounded-3xl bg-[#090C10] border border-white/10 overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-blueprint-grid opacity-35" />

        {/* Tactical Map SVG with Cairo Landmarks */}
        <svg viewBox="0 0 400 300" className="w-full h-full relative z-10">
          <defs>
            <radialGradient id="mapGlowRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Faint Cairo Nile River Path */}
          <path
            d="M 200 0 Q 185 80 195 150 T 215 300"
            fill="none"
            stroke="#1E293B"
            strokeWidth="10"
            opacity="0.4"
          />

          {/* Site Pins */}
          {sites.map((site, index) => {
            // Project Cairo Lat/Lng roughly to SVG canvas
            // Lat range ~29.9 to 30.15; Lng range ~30.9 to 31.7
            const x = 50 + ((site.lng - 30.95) / (31.75 - 30.95)) * 300;
            const y = 260 - ((site.lat - 29.92) / (30.12 - 29.92)) * 220;

            const isShort = site.onDutyGuards < site.requiredGuards;
            const ringColor =
              site.status === 'optimal'
                ? '#22C55E'
                : site.status === 'warning'
                ? '#F59E0B'
                : '#EF4444';

            return (
              <g
                key={site.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => setSelectedSiteDrawer(site.id)}
                className="cursor-pointer group"
              >
                {/* Geofence coverage circle */}
                <circle
                  cx="0"
                  cy="0"
                  r={isShort ? "20" : "15"}
                  fill={ringColor}
                  fillOpacity="0.15"
                  stroke={ringColor}
                  strokeWidth="1.5"
                  strokeDasharray={isShort ? "3 2" : "none"}
                />

                {/* Center marker */}
                <circle cx="0" cy="0" r="4" fill={ringColor} />

                {/* Guard Count Badge */}
                <text
                  x="0"
                  y="-12"
                  fill="#E2E8F0"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {site.onDutyGuards}/{site.requiredGuards}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-2.5 start-2.5 z-20 flex items-center gap-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono-telemetry text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Optimal</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Short (1-2)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Critical</span>
          </span>
        </div>
      </div>

      {/* Sites List (Tap to Dispatch or Inspect) */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
          All Monitored Facilities
        </span>

        {sites.map((site) => {
          const shortage = site.requiredGuards - site.onDutyGuards;

          return (
            <div
              key={site.id}
              onClick={() => setSelectedSiteDrawer(site.id)}
              className="p-3.5 rounded-2xl bg-[#0D1219] border border-white/10 hover:border-white/20 active:scale-98 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1 min-w-0 me-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      site.status === 'optimal'
                        ? 'bg-emerald-500'
                        : site.status === 'warning'
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-red-500 animate-ping'
                    }`}
                  />
                  <h4 className="text-xs font-bold text-slate-200 truncate">
                    {language === 'ar' ? site.nameAr : site.name}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {language === 'ar' ? site.cityAr : site.city} · Supervisor: {site.supervisorName}
                </p>
              </div>

              <div className="text-end shrink-0">
                <span
                  className={`text-xs font-mono-telemetry font-bold block ${
                    shortage > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {site.onDutyGuards} / {site.requiredGuards} Guards
                </span>
                {shortage > 0 && (
                  <span className="text-[10px] font-mono-telemetry text-red-400 block font-bold">
                    Short {shortage}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* One-Tap Dispatch Standby Pool Drawer */}
      {activeDrawerSite && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0F141C] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wide text-slate-100">
                  {activeDrawerSite.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Required: {activeDrawerSite.requiredGuards} · On Post: {activeDrawerSite.onDutyGuards}
                </p>
              </div>
              <button
                onClick={() => setSelectedSiteDrawer(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
                {t.standbyPool} (Sorted by Distance & ETA)
              </span>

              {STANDBY_GUARDS_POOL.map((guard) => (
                <div
                  key={guard.id}
                  className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={guard.avatarUrl}
                      alt={guard.name}
                      className="w-10 h-10 rounded-xl object-cover border border-amber-400/40"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{guard.name}</p>
                      <p className="text-[10px] font-mono-telemetry text-slate-400">
                        {guard.distanceKm} km · ETA {guard.etaMinutes} mins
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      dispatchGuardToSite(guard.id, activeDrawerSite.id);
                      setSelectedSiteDrawer(null);
                    }}
                    className="h-8 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-telemetry text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Send className="w-3 h-3" />
                    <span>{t.dispatchGuard}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
