import React from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { GeofenceHeroRing } from '../components/GeofenceHeroRing';
import { TacticalMapView } from '../components/TacticalMapView';
import {
  Shield,
  MapPin,
  Clock,
  Camera,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TodayScreenProps {
  onOpenCheckIn: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ onOpenCheckIn }) => {
  const {
    brand,
    language,
    useEasternNumerals,
    sites,
    selectedSiteId,
    currentUser,
    isOnPost,
    isSelfieRequired,
    selfieSecondsLeft,
    attendanceEvents,
    isMockLocationDetected,
  } = useAppStore();

  const t = translations[language];
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  // Weekly hours chart data
  const weeklyData = [
    { day: language === 'ar' ? 'السبت' : 'Sat', regular: 12, overtime: 0 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', regular: 12, overtime: 2 },
    { day: language === 'ar' ? 'الإثنين' : 'Mon', regular: 12, overtime: 3 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', regular: 12, overtime: 0 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', regular: 12, overtime: 1.5 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', regular: 12, overtime: 2 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', regular: 0, overtime: 0 },
  ];

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-2">
      {/* Anti-Fraud Mock Location Alert Banner */}
      {isMockLocationDetected && (
        <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 shadow-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-xs">
            <p className="font-bold font-mono-telemetry uppercase tracking-wider text-red-300">
              {t.mockLocationTitle}
            </p>
            <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
              {t.mockLocationBody}
            </p>
          </div>
        </div>
      )}

      {/* Random Selfie Window Prompt Banner */}
      {isSelfieRequired && (
        <div
          onClick={onOpenCheckIn}
          className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 shadow-xl flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-xs">
              <p className="font-bold font-mono-telemetry uppercase">
                {t.selfieRequiredTitle}
              </p>
              <p className="text-[11px] opacity-80">
                {t.selfieRequiredBody}
              </p>
            </div>
          </div>
          <span className="font-mono-telemetry text-xs font-bold text-amber-300 px-2 py-1 bg-amber-500/20 rounded-lg">
            04:42
          </span>
        </div>
      )}

      {/* Hero 1: The Geofence Radar Ring & Shift Counter */}
      <GeofenceHeroRing />

      {/* Assigned Site Tactical Overview Card */}
      <div className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.assignedSite}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100 font-display mt-0.5">
              {language === 'ar' ? activeSite.nameAr : activeSite.name}
            </h2>
            <p className="text-xs text-slate-400 font-body">
              {language === 'ar' ? activeSite.addressAr : activeSite.address}
            </p>
          </div>
        </div>

        {/* Shift Timetable Strip */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono-telemetry">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {language === 'ar' ? currentUser.assignedShift.titleAr : currentUser.assignedShift.title}
            </span>
          </div>
          <span className="font-mono-telemetry font-bold text-amber-400">
            {currentUser.assignedShift.startTime} — {currentUser.assignedShift.endTime}
          </span>
        </div>
      </div>

      {/* Mini Tactical Geofence Map */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
            Geofence Perimeter & GPS Radar
          </span>
          <span className="text-[10px] text-slate-500 font-mono-telemetry">
            Radius: {activeSite.radiusMeters}m
          </span>
        </div>
        <TacticalMapView height={200} />
      </div>

      {/* Weekly Hours Bar Chart (Recharts) */}
      <div className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold font-mono-telemetry uppercase tracking-wider text-slate-300">
              {t.weeklyAttendance}
            </h3>
            <p className="text-[11px] text-slate-400">
              {formatNumber(56.5, language, useEasternNumerals)} hrs total · {formatNumber(8.5, language, useEasternNumerals)} hrs OT
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono-telemetry text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-slate-600" />
              <span>{t.regularHours}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: accentColor }} />
              <span>{t.overtimeHours}</span>
            </span>
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#11151B',
                  borderColor: '#334155',
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <Bar dataKey="regular" stackId="a" fill="#334155" radius={[0, 0, 0, 0]} />
              <Bar dataKey="overtime" stackId="a" fill={accentColor} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cryptographic Event Log Snippet */}
      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono-telemetry">
        <div className="flex items-center gap-1.5 truncate">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{t.tamperProofSignature}:</span>
        </div>
        <span className="text-amber-400 font-bold shrink-0 ms-2">
          {attendanceEvents[0]?.signatureHash || '0x8F4A19B2...D4E8'}
        </span>
      </div>
    </div>
  );
};
