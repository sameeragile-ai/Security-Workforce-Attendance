import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { BrandShieldLogo } from '../components/BrandShieldLogo';
import {
  Shield,
  Smartphone,
  QrCode,
  FileText,
  DollarSign,
  GraduationCap,
  Shirt,
  Settings,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

export const ProfileMeScreen: React.FC = () => {
  const {
    brand,
    role,
    language,
    useEasternNumerals,
    theme,
    setTheme,
    setLanguage,
    setUseEasternNumerals,
    currentUser,
    requests,
    payslips,
    training,
  } = useAppStore();

  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  const [activeSection, setActiveSection] = useState<'badge' | 'requests' | 'payslips' | 'training' | 'uniform'>('badge');

  return (
    <div className="space-y-4 pb-28 px-3.5 pt-2">
      {/* 1. Tactical Security Clearance ID Badge (Holographic Shimmer) */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#0D1522] via-[#091019] to-[#06080C] border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden select-none">
        {/* Hologram Shimmer Ribbon */}
        <div
          className="absolute -top-12 -end-12 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div className="absolute inset-0 bg-mashrabiya opacity-20 pointer-events-none" />

        {/* Top Monogram & Clearance Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <BrandShieldLogo brand={brand} size={38} showRadar />
            <div>
              <p className="text-[11px] font-bold font-mono-telemetry uppercase tracking-wider text-amber-400">
                {isAman ? 'AMAN SECURITY FORCES' : 'NILE FACILITY GROUP'}
              </p>
              <p className="text-[9px] font-mono-telemetry text-slate-400">
                {currentUser.clearanceLevel}
              </p>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-black/40 border border-white/10">
            <QrCode className="w-6 h-6 text-slate-300" />
          </div>
        </div>

        {/* Photo + Identity Details */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -end-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0D1522]" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-100 font-display truncate">
              {currentUser.name}
            </h3>
            <p className="text-xs text-amber-300 font-body truncate">
              {currentUser.nameAr}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono-telemetry text-slate-400 mt-1">
              <span>ID: {currentUser.employeeId}</span>
              <span>·</span>
              <span>NAT: {currentUser.nationalIdMasked}</span>
            </div>
          </div>
        </div>

        {/* Bound Device & Biometrics Strip */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-telemetry text-slate-400">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{currentUser.registeredDevice.model}</span>
          </div>
          <span className="text-emerald-400 font-bold">BOUND ✓</span>
        </div>
      </div>

      {/* Segmented Sub-Nav */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-mono-telemetry">
        <button
          onClick={() => setActiveSection('badge')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeSection === 'badge' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('requests')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeSection === 'requests' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
          }`}
        >
          {t.requests}
        </button>
        <button
          onClick={() => setActiveSection('payslips')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeSection === 'payslips' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
          }`}
        >
          {t.payslips}
        </button>
        <button
          onClick={() => setActiveSection('training')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeSection === 'training' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
          }`}
        >
          {t.training}
        </button>
      </div>

      {/* Section 2: Requests & Multi-Level Approvals */}
      {activeSection === 'requests' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono-telemetry uppercase text-slate-400">
              Submitted Requests Tracker
            </h4>
            <button className="text-xs font-mono-telemetry text-amber-400 hover:underline">
              + New Request
            </button>
          </div>

          {requests.map((req) => (
            <div
              key={req.id}
              className="p-3.5 rounded-2xl bg-[#0D1219] border border-white/10 text-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-slate-200">
                  {req.type === 'leave' ? t.requestLeave : t.requestAdvance} ({req.amountOrDays})
                </span>
                <span className="text-[10px] font-mono-telemetry text-slate-500">
                  {req.dateSubmitted}
                </span>
              </div>
              <p className="text-slate-400 mb-2 leading-relaxed">{req.details}</p>

              {/* Approval Ladder */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-telemetry">
                <span className="text-slate-500">Approver: {req.currentApprover}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold ${
                    req.status === 'finance_approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {req.status === 'finance_approved' ? 'APPROVED' : 'IN REVIEW'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Payslips Breakdown (EGP) */}
      {activeSection === 'payslips' && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono-telemetry uppercase text-slate-400">
            Monthly Salary Records
          </h4>

          {payslips.map((pay) => (
            <div
              key={pay.id}
              className="p-4 rounded-3xl bg-[#0D1219] border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-100 font-display">
                  {language === 'ar' ? pay.monthYearAr : pay.monthYear}
                </span>
                <span className="text-xs font-bold font-mono-telemetry text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  DISBURSED
                </span>
              </div>

              {/* Financial Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-telemetry mb-3">
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-500 block">Basic Pay</span>
                  <span className="text-slate-200 font-bold">
                    {formatNumber(pay.basicSalaryEGP, language, useEasternNumerals)} {t.currencyEgp}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-500 block">Overtime ({pay.overtimeHours}h)</span>
                  <span className="text-amber-400 font-bold">
                    +{formatNumber(pay.overtimePayEGP, language, useEasternNumerals)} {t.currencyEgp}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-500 block">Allowances</span>
                  <span className="text-slate-200 font-bold">
                    +{formatNumber(pay.allowanceEGP, language, useEasternNumerals)} {t.currencyEgp}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-slate-500 block">Deductions</span>
                  <span className="text-red-400 font-bold">
                    -{formatNumber(pay.deductionsEGP, language, useEasternNumerals)} {t.currencyEgp}
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between font-mono-telemetry text-xs">
                <span className="text-slate-400 font-bold">{t.netSalary}:</span>
                <span className="text-base font-bold text-amber-400">
                  {formatNumber(pay.netPayEGP, language, useEasternNumerals)} {t.currencyEgp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 4: Training & Assessments */}
      {activeSection === 'training' && (
        <div className="space-y-3">
          <h4 className="text-xs font-mono-telemetry uppercase text-slate-400">
            Security Certifications & Modules
          </h4>

          {training.map((mod) => (
            <div
              key={mod.id}
              className="p-3.5 rounded-2xl bg-[#0D1219] border border-white/10 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono-telemetry uppercase text-slate-500 block">
                  {mod.category} · {mod.durationMinutes} min
                </span>
                <p className="text-xs font-bold text-slate-200 truncate mt-0.5">
                  {language === 'ar' ? mod.titleAr : mod.title}
                </p>
                {mod.completed && (
                  <span className="text-[11px] font-mono-telemetry text-emerald-400 font-bold">
                    Score: {mod.scorePercent}% Passed ✓
                  </span>
                )}
              </div>

              <button
                className={`px-3 py-1.5 rounded-xl font-mono-telemetry text-xs font-bold shrink-0 ${
                  mod.completed
                    ? 'bg-white/5 text-slate-400'
                    : 'bg-amber-500 text-slate-950'
                }`}
              >
                {mod.completed ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* iOS-Style Settings Group */}
      <div className="rounded-3xl bg-[#0D1219] border border-white/10 p-3 space-y-1">
        <div className="flex items-center justify-between p-2">
          <span className="text-xs text-slate-300 font-medium">Dark / Light Patrol Mode</span>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono-telemetry text-amber-300"
          >
            {theme === 'dark' ? 'NIGHT WATCH' : 'DAY PATROL'}
          </button>
        </div>

        <div className="flex items-center justify-between p-2 border-t border-white/5">
          <span className="text-xs text-slate-300 font-medium">Language (العربية / English)</span>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono-telemetry text-amber-300"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {language === 'ar' && (
          <div className="flex items-center justify-between p-2 border-t border-white/5">
            <span className="text-xs text-slate-300 font-medium">الأرقام المشرقية (٠-٩)</span>
            <button
              onClick={() => setUseEasternNumerals(!useEasternNumerals)}
              className="px-3 py-1 rounded-xl bg-white/10 text-xs font-mono-telemetry text-amber-300"
            >
              {useEasternNumerals ? 'مفعّل (٠-٩)' : 'غربي (0-9)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
