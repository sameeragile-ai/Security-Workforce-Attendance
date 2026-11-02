import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/appStore';
import { isInsideGeofence, formatDistance } from '../lib/geo';
import { translations, formatNumber } from '../i18n';
import { Shield, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const GeofenceHeroRing: React.FC = () => {
  const {
    brand,
    language,
    useEasternNumerals,
    sites,
    selectedSiteId,
    guardLocation,
    isOnPost,
    shiftSeconds,
    incrementShiftTimer,
    isMockLocationDetected,
  } = useAppStore();

  const t = translations[language];
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  // Calculate geofence position
  const { isInside, distanceMeters } = isInsideGeofence(
    guardLocation,
    { lat: activeSite.lat, lng: activeSite.lng },
    activeSite.radiusMeters
  );

  // Shift timer tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      incrementShiftTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementShiftTimer]);

  // Format shift timer HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    const timeStr = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return formatNumber(timeStr, language, useEasternNumerals);
  };

  return (
    <div className="relative w-full rounded-3xl p-5 bg-[#0D1219] border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden select-none">
      {/* Blueprint Grid Watermark */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />

      {/* Tactical Corner Brackets */}
      <div className="absolute top-2.5 start-2.5 text-slate-700 font-mono-telemetry text-xs">⌜</div>
      <div className="absolute top-2.5 end-2.5 text-slate-700 font-mono-telemetry text-xs">⌝</div>
      <div className="absolute bottom-2.5 start-2.5 text-slate-700 font-mono-telemetry text-xs">⌞</div>
      <div className="absolute bottom-2.5 end-2.5 text-slate-700 font-mono-telemetry text-xs">⌟</div>

      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isMockLocationDetected
                ? 'bg-red-500 animate-ping'
                : isOnPost
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-mono-telemetry font-bold tracking-wider text-slate-300">
            {isMockLocationDetected
              ? t.breach
              : isOnPost
              ? t.onPost
              : t.offDuty}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-mono-telemetry text-slate-400">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{formatTimer(shiftSeconds)}</span>
        </div>
      </div>

      {/* Central Large Radar Geofence Ring */}
      <div className="relative flex items-center justify-center my-3 py-2">
        {/* Outer Pulsing Glow */}
        <div
          className={`absolute w-48 h-48 rounded-full blur-xl transition-all duration-700 ${
            isMockLocationDetected
              ? 'bg-red-500/25 animate-ping'
              : isInside
              ? 'bg-amber-500/15'
              : 'bg-slate-800/10'
          }`}
        />

        {/* The Perimeter Ring */}
        <div
          className={`relative w-44 h-44 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
            isMockLocationDetected
              ? 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              : isInside
              ? 'border-amber-400/80 shadow-[0_0_30px_rgba(255,176,32,0.25)]'
              : 'border-slate-700'
          }`}
        >
          {/* Rotating Tactical Radar Sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div
              className="w-full h-full animate-radar origin-center"
              style={{
                background: `conic-gradient(from 0deg, transparent 0deg, transparent 290deg, ${
                  isMockLocationDetected ? '#EF4444' : accentColor
                } 360deg)`,
                opacity: 0.25,
              }}
            />
          </div>

          {/* Concentric Inner Guides */}
          <div className="absolute inset-3 rounded-full border border-dashed border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5" />

          {/* Center Hub Display */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-2">
            <span
              className="text-2xl font-bold font-mono-telemetry tracking-tight"
              style={{ color: isMockLocationDetected ? '#EF4444' : isInside ? accentColor : '#94A3B8' }}
            >
              {formatDistance(distanceMeters, language === 'ar')}
            </span>
            <span className="text-[10px] font-mono-telemetry uppercase tracking-wider text-slate-400 mt-0.5">
              {isMockLocationDetected
                ? 'SPOOF DETECTED'
                : isInside
                ? t.perimeterStatusInside
                : t.perimeterStatusOutside}
            </span>
            <span className="text-[9px] text-slate-500 font-body mt-0.5">
              {t.distanceFromCenter}
            </span>
          </div>

          {/* Guard Glowing Dot inside/outside perimeter */}
          <motion.div
            animate={{
              x: isInside ? 32 : 72,
              y: isInside ? -28 : -65,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="absolute z-20"
          >
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 border-[#0D1219] ${
                isMockLocationDetected
                  ? 'bg-red-500 animate-ping'
                  : isInside
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Status Line & Anti-Tamper Badge */}
      <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono-telemetry">
        <div className="flex items-center gap-1.5 truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {isInside ? t.insideSuccess : t.outsideWarning}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 shrink-0 ms-2 font-mono-telemetry">
          ±{guardLocation.accuracyMeters}m GPS
        </span>
      </div>
    </div>
  );
};
