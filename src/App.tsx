/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/appStore';
import { translations, formatNumber } from './i18n';
import { SplashScreen } from './components/SplashScreen';
import { TopAppBar } from './components/TopAppBar';
import { BottomTabBar, TabId } from './components/BottomTabBar';
import { CheckInModal } from './components/CheckInModal';
import { SyncQueueModal } from './components/SyncQueueModal';
import { DemoControlPanel } from './components/DemoControlPanel';
import { LoginBindingModal } from './components/LoginBindingModal';
import { PushNotificationBannerList } from './components/PushNotificationBannerList';
import { BrandShieldLogo } from './components/BrandShieldLogo';

// Screens
import { TodayScreen } from './screens/TodayScreen';
import { IncidentsScreen } from './screens/IncidentsScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ProfileMeScreen } from './screens/ProfileMeScreen';
import { SupervisorOpsMapScreen } from './screens/SupervisorOpsMapScreen';
import { SupervisorAlertsScreen } from './screens/SupervisorAlertsScreen';
import { SupervisorShiftsScreen } from './screens/SupervisorShiftsScreen';

import {
  Shield,
  Radio,
  SlidersHorizontal,
  Smartphone,
  Eye,
  RefreshCw,
  Power,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const {
    brand,
    role,
    language,
    useEasternNumerals,
    theme,
    isAppKilledSimulated,
    setAppKilledSimulated,
    isOffline,
  } = useAppStore();

  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  // Splash screen state (shown on initial load)
  const [showSplash, setShowSplash] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<TabId>(role === 'supervisor' ? 'ops-map' : 'today');

  // Sync tab when role switches
  useEffect(() => {
    setActiveTab(role === 'supervisor' ? 'ops-map' : 'today');
  }, [role]);

  // Modals state
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [syncQueueModalOpen, setSyncQueueModalOpen] = useState(false);
  const [demoControlsModalOpen, setDemoControlsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Navigation helper for push notifications
  const handlePushNavigate = (path: string) => {
    if (path === '/checkin') setCheckInModalOpen(true);
    else if (path === '/sync-queue') setSyncQueueModalOpen(true);
    else if (path === '/incidents') setActiveTab('incidents');
    else if (path === '/messages') setActiveTab('messages');
    else if (path === '/me') setActiveTab('me');
    else if (path === '/ops-map') setActiveTab('ops-map');
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#07090C] text-slate-100' : 'bg-[#EFECE6] text-slate-900'
      }`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Atmospheric Operations Backdrop for Desktop */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />
      <div
        className="hidden md:block absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* DESKTOP EDITORIAL SIDE PANEL (Visible on >=1100px screens) */}
      <aside
        aria-label="Operations Overview"
        className="hidden xl:flex flex-col justify-between w-[370px] max-h-[820px] p-6 z-10 select-none overflow-y-auto no-scrollbar"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrandShieldLogo brand={brand} size={42} showRadar />
            <div>
              <h1 className="text-2xl font-bold font-display uppercase tracking-wider text-slate-100 leading-none">
                {t.appName}
              </h1>
              <p className="text-[11px] font-mono-telemetry text-amber-400 mt-1">
                {isAman ? t.brandAman : t.brandNile}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-body">
            {t.appTagline}. Purpose-built for security guarding and facility operations across Egypt.
          </p>

          {/* Environment Badges */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-[11px] font-mono-telemetry">
            <div className="flex items-center justify-between text-slate-400">
              <span>ENVIRONMENT:</span>
              <span className="text-emerald-400 font-bold">CLIENT DEMO v2.4</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>COVERAGE:</span>
              <span className="text-slate-200">14 Cairo/Giza Sites</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>DEPLOYED GUARDS:</span>
              <span className="text-slate-200">186 on watch</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>ACTIVE ROLE:</span>
              <span className="text-amber-400 font-bold uppercase">{role}</span>
            </div>
          </div>

          {/* Inline Embedded Demo Control Panel */}
          <DemoControlPanel isSidebar />

          <button
            onClick={() => setLoginModalOpen(true)}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-telemetry font-bold text-slate-300 flex items-center justify-center gap-2 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Test National ID & Device Binding</span>
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 text-[10px] font-mono-telemetry text-slate-500">
          Mobile Prototype · iOS 18 Design Language · Cairo EET
        </div>
      </aside>

      {/* SMARTPHONE CANVAS CONTAINER */}
      <main
        className={`relative w-full h-full md:w-[412px] md:h-[min(840px,calc(100vh-56px))] md:my-auto md:rounded-[48px] md:border-[8px] md:border-stone-900/95 dark:md:border-stone-800/90 md:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col bg-[#07090C] transition-all`}
      >
        {/* Hardware Speaker Pill / Dynamic Island Notch */}
        <div className="hidden md:block absolute top-2 inset-x-0 z-50 pointer-events-none">
          <div className="w-24 h-4 bg-stone-950 rounded-full mx-auto border border-stone-800/60 shadow-inner" />
        </div>

        {/* Offline Warning Banner */}
        {isOffline && (
          <div
            onClick={() => setSyncQueueModalOpen(true)}
            className="w-full py-1.5 px-3 bg-amber-500 text-slate-950 text-[10px] font-mono-telemetry font-bold text-center cursor-pointer shadow-md select-none shrink-0"
          >
            {t.offlineModeBanner} (TAP TO VIEW QUEUE)
          </div>
        )}

        {/* Top App Bar */}
        <TopAppBar
          title={t.appName}
          onOpenSyncQueue={() => setSyncQueueModalOpen(true)}
          onOpenDemoControls={() => setDemoControlsModalOpen(true)}
        />

        {/* iOS-Style Push Notification Banners */}
        <PushNotificationBannerList onNavigate={handlePushNavigate} />

        {/* SCROLLABLE INNER APPLICATION CONTENT */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative z-10 overscroll-contain">
          {/* Guard Mode Tabs */}
          {role === 'guard' && (
            <>
              {activeTab === 'today' && (
                <TodayScreen onOpenCheckIn={() => setCheckInModalOpen(true)} />
              )}
              {activeTab === 'incidents' && <IncidentsScreen />}
              {activeTab === 'messages' && <MessagesScreen />}
              {activeTab === 'me' && <ProfileMeScreen />}
            </>
          )}

          {/* Supervisor Mode Tabs */}
          {role === 'supervisor' && (
            <>
              {activeTab === 'ops-map' && <SupervisorOpsMapScreen />}
              {activeTab === 'alerts' && <SupervisorAlertsScreen />}
              {activeTab === 'shifts' && <SupervisorShiftsScreen />}
              {activeTab === 'me' && <ProfileMeScreen />}
            </>
          )}
        </div>

        {/* Floating Bottom Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'checkin') {
              setCheckInModalOpen(true);
            } else if (tab === 'dispatch') {
              setActiveTab('ops-map');
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenCheckInSheet={() => {
            if (role === 'supervisor') {
              setActiveTab('ops-map');
            } else {
              setCheckInModalOpen(true);
            }
          }}
        />

        {/* APP SLEEP / KILLED SIMULATION OVERLAY */}
        {isAppKilledSimulated && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none">
            <Power className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
            <h3 className="text-base font-bold font-display uppercase tracking-wider text-slate-200">
              App Sleeping in Background
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-body">
              OS-level background geofencing monitors the site perimeter. Crossing the boundary triggers local hardware wakeup and cryptographically queues the event.
            </p>
            <button
              onClick={() => setAppKilledSimulated(false)}
              className="mt-6 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-bold font-mono-telemetry text-xs shadow-lg active:scale-95"
            >
              Wake Application
            </button>
          </div>
        )}
      </main>

      {/* MODALS */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
      />

      <SyncQueueModal
        isOpen={syncQueueModalOpen}
        onClose={() => setSyncQueueModalOpen(false)}
      />

      <DemoControlPanel
        isOpen={demoControlsModalOpen}
        onClose={() => setDemoControlsModalOpen(false)}
      />

      <LoginBindingModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
