import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { Cloud, CloudOff, Bell, ChevronDown, RefreshCw, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandShieldLogo } from './BrandShieldLogo';

interface TopAppBarProps {
  title: string;
  onOpenSyncQueue?: () => void;
  onOpenDemoControls?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  onOpenSyncQueue,
  onOpenDemoControls,
  showBack = false,
  onBack,
}) => {
  const {
    brand,
    role,
    language,
    useEasternNumerals,
    sites,
    selectedSiteId,
    setSelectedSiteId,
    isOffline,
    syncQueue,
    isSyncing,
    notifications,
  } = useAppStore();

  const t = translations[language];
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  const pendingCount = syncQueue.length;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07090C]/90 dark:bg-[#07090C]/90 border-b border-white/5 transition-all duration-200 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left / Start Side: Back Button OR Site Switcher Pill */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 transition-all"
              aria-label="Back"
            >
              {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-98 border border-white/10 text-xs font-medium text-slate-200 transition-all max-w-[200px]"
              >
                <BrandShieldLogo brand={brand} size={18} />
                <span className="truncate">
                  {language === 'ar' ? activeSite.nameAr : activeSite.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Site Selector Dropdown */}
              {siteDropdownOpen && (
                <div
                  className="absolute top-full start-0 mt-1 w-64 bg-[#11151B] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden"
                  onClick={() => setSiteDropdownOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400 border-b border-white/5">
                    {t.assignedSite}
                  </div>
                  <div className="max-h-56 overflow-y-auto no-scrollbar py-1">
                    {sites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => setSelectedSiteId(site.id)}
                        className={`w-full text-start px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          site.id === selectedSiteId
                            ? 'bg-amber-500/15 text-amber-300 font-semibold'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="truncate me-2">
                          <p className="truncate font-medium">{language === 'ar' ? site.nameAr : site.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{language === 'ar' ? site.cityAr : site.city}</p>
                        </div>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            site.status === 'optimal'
                              ? 'bg-emerald-500'
                              : site.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right / End Side: Sync Status Pill + Demo Control Quick Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Offline / Sync Status Indicator */}
          <button
            onClick={onOpenSyncQueue}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-mono-telemetry border transition-all ${
              isOffline
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : pendingCount > 0
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
            title="Sync Status & Queue"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : isOffline ? (
              <CloudOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Cloud className="w-3.5 h-3.5" />
            )}
            <span>
              {isOffline
                ? `OFFLINE (${formatNumber(pendingCount, language, useEasternNumerals)})`
                : pendingCount > 0
                ? `${formatNumber(pendingCount, language, useEasternNumerals)} PENDING`
                : t.synced}
            </span>
          </button>

          {/* Quick Demo Controls Button (mobile & desktop trigger) */}
          <button
            onClick={onOpenDemoControls}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-slate-300 transition-all border border-white/10"
            title="Demo Controls"
            aria-label="Demo Controls"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
