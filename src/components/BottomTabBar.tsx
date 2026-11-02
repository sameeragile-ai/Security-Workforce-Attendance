import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n';
import {
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  User,
  MapPin,
  Radio,
  CalendarDays,
  Send,
  BellRing,
} from 'lucide-react';

export type TabId = 'today' | 'incidents' | 'checkin' | 'messages' | 'me' | 'ops-map' | 'alerts' | 'dispatch' | 'shifts';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenCheckInSheet: () => void;
}

interface TabItem {
  id: TabId;
  label: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isCenter?: boolean;
  badge?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  onOpenCheckInSheet,
}) => {
  const { role, brand, language, isOnPost, urgentAlert } = useAppStore();
  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  // Guard navigation vs Supervisor navigation
  const isSupervisor = role === 'supervisor';

  const guardTabs: TabItem[] = [
    { id: 'today', label: t.tabToday, icon: ShieldCheck },
    { id: 'incidents', label: t.tabIncidents, icon: AlertTriangle },
    { id: 'checkin', label: t.tabCheckIn, isCenter: true },
    { id: 'messages', label: t.tabMessages, icon: MessageSquare, badge: urgentAlert.active },
    { id: 'me', label: t.tabMe, icon: User },
  ];

  const supervisorTabs: TabItem[] = [
    { id: 'ops-map', label: t.tabOpsMap, icon: MapPin },
    { id: 'alerts', label: t.tabAlerts, icon: BellRing },
    { id: 'dispatch', label: t.tabDispatch, isCenter: true },
    { id: 'shifts', label: t.tabShifts, icon: CalendarDays },
    { id: 'me', label: t.tabMe, icon: User },
  ];

  const tabs: TabItem[] = isSupervisor ? supervisorTabs : guardTabs;

  return (
    <div className="absolute bottom-2 inset-x-3 z-40 select-none pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto relative flex items-center justify-between px-2 py-1.5 rounded-3xl backdrop-blur-2xl bg-[#0E131A]/92 dark:bg-[#0E131A]/92 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
      >
        {tabs.map((tab) => {
          if (tab.isCenter) {
            // Raised Center Action Button
            return (
              <div key="center_btn" className="relative flex flex-col items-center justify-center -top-4 px-1">
                <button
                  onClick={onOpenCheckInSheet}
                  className="relative group flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.5)] active:scale-90 transition-transform"
                  style={{
                    backgroundColor: isAman ? '#0B1626' : '#0A2E2C',
                    border: `2.5px solid ${accentColor}`,
                  }}
                  aria-label={isSupervisor ? t.tabDispatch : t.tabCheckIn}
                >
                  {/* Glowing background halo */}
                  <div
                    className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* Pulsing indicator dot if on post */}
                  {isOnPost && !isSupervisor && (
                    <span className="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0E131A] animate-pulse" />
                  )}

                  <div className="relative z-10 flex flex-col items-center justify-center">
                    {isSupervisor ? (
                      <Send className="w-6 h-6" style={{ color: accentColor }} />
                    ) : (
                      <Radio className="w-6 h-6 animate-pulse" style={{ color: accentColor }} />
                    )}
                  </div>
                </button>
                <span
                  className="text-[10px] font-semibold tracking-wider font-display uppercase mt-1"
                  style={{ color: accentColor }}
                >
                  {isSupervisor ? t.tabDispatch : t.tabCheckIn}
                </span>
              </div>
            );
          }

          const Icon = tab.icon!;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[46px] py-1 px-1 rounded-2xl transition-all ${
                isActive ? 'text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Tab Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-2xl bg-white/10 border border-white/5"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5" style={{ color: isActive ? accentColor : undefined }} />
                  {tab.badge && (
                    <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight font-body leading-none truncate max-w-[54px]">
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
