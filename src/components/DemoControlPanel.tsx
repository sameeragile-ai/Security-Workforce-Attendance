import React from 'react';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n';
import { BrandId, UserRole } from '../types';
import {
  SlidersHorizontal,
  Navigation,
  CloudOff,
  Cloud,
  Moon,
  Sun,
  Camera,
  Flame,
  RotateCcw,
  Shield,
  Smartphone,
  Globe,
  Radio,
  Layers,
  X,
} from 'lucide-react';
import { BrandShieldLogo } from './BrandShieldLogo';

interface DemoControlPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  isSidebar?: boolean;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  isOpen = false,
  onClose,
  isSidebar = false,
}) => {
  const {
    brand,
    setBrand,
    role,
    setRole,
    language,
    setLanguage,
    theme,
    setTheme,
    walkInsideSite,
    walkOutsideSite,
    teleportMockLocation,
    isOffline,
    toggleOffline,
    triggerRandomSelfieCheck,
    triggerSOS,
    resetDemoData,
    isAppKilledSimulated,
    setAppKilledSimulated,
  } = useAppStore();

  const t = translations[language];

  const content = (
    <div className="space-y-4 text-xs font-mono-telemetry select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
            {t.demoControls}
          </h3>
        </div>
        {!isSidebar && onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 1. Multi-Brand Switcher */}
      <div>
        <label className="text-[10px] uppercase text-slate-400 block mb-1.5">
          1. Brand Switcher (Instant Retheme)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setBrand('aman')}
            className={`p-2.5 rounded-2xl flex items-center gap-2 border transition-all text-start ${
              brand === 'aman'
                ? 'bg-[#0B1626] border-amber-500 text-amber-300 shadow-md'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <BrandShieldLogo brand="aman" size={24} />
            <div className="truncate">
              <span className="font-bold block truncate">Aman Guard</span>
              <span className="text-[9px] text-slate-400 block">Navy & Amber</span>
            </div>
          </button>

          <button
            onClick={() => setBrand('nile')}
            className={`p-2.5 rounded-2xl flex items-center gap-2 border transition-all text-start ${
              brand === 'nile'
                ? 'bg-[#0A2E2C] border-[#D4A857] text-[#D4A857] shadow-md'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            <BrandShieldLogo brand="nile" size={24} />
            <div className="truncate">
              <span className="font-bold block truncate">Nile Facility</span>
              <span className="text-[9px] text-slate-400 block">Teal & Brass Gold</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Role Switcher */}
      <div>
        <label className="text-[10px] uppercase text-slate-400 block mb-1.5">
          2. Perspective / Role Switcher
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setRole('guard')}
            className={`p-2 rounded-xl text-center border font-bold transition-all ${
              role === 'guard'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Site Guard
          </button>
          <button
            onClick={() => setRole('supervisor')}
            className={`p-2 rounded-xl text-center border font-bold transition-all ${
              role === 'supervisor'
                ? 'bg-blue-500 text-white border-blue-400 shadow-md'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            Ops Supervisor
          </button>
        </div>
      </div>

      {/* 3. GPS Geofence Movement Simulator */}
      <div>
        <label className="text-[10px] uppercase text-slate-400 block mb-1.5">
          3. GPS Geofence Simulator
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={walkInsideSite}
            className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold text-center active:scale-95 transition-transform"
          >
            Walk In (42m)
          </button>
          <button
            onClick={walkOutsideSite}
            className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[10px] font-bold text-center active:scale-95 transition-transform"
          >
            Walk Out (1.3km)
          </button>
          <button
            onClick={teleportMockLocation}
            className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-[10px] font-bold text-center active:scale-95 transition-transform"
          >
            Teleport (Mock)
          </button>
        </div>
      </div>

      {/* 4. Hardware & Offline Scenarios */}
      <div>
        <label className="text-[10px] uppercase text-slate-400 block mb-1.5">
          4. Hardware & Fraud Simulations
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleOffline}
            className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all ${
              isOffline
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            {isOffline ? <CloudOff className="w-3.5 h-3.5" /> : <Cloud className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Offline (Queued)' : 'Toggle Offline'}</span>
          </button>

          <button
            onClick={() => setAppKilledSimulated(!isAppKilledSimulated)}
            className={`p-2 rounded-xl border text-center font-bold transition-all ${
              isAppKilledSimulated
                ? 'bg-purple-600 text-white border-purple-400'
                : 'bg-white/5 border-white/10 text-slate-300'
            }`}
          >
            Simulate App Sleep
          </button>

          <button
            onClick={triggerRandomSelfieCheck}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Random Selfie</span>
          </button>

          <button
            onClick={() => triggerSOS('Emergency panic signal from command panel')}
            className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 flex items-center justify-center gap-1.5 font-bold"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Trigger SOS</span>
          </button>
        </div>
      </div>

      {/* 5. Language & Theme Quick Toggles */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'en' ? 'العربية (RTL)' : 'English'}</span>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5"
        >
          {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span>{theme === 'dark' ? 'Night Watch' : 'Day Patrol'}</span>
        </button>

        <button
          onClick={resetDemoData}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300"
          title="Reset Seed Data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  if (isSidebar) {
    return <div className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-2xl">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F141C] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar">
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />
        {content}
      </div>
    </div>
  );
};
