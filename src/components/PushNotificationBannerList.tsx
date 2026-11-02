import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/appStore';
import { PushNotificationBanner } from '../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  X,
} from 'lucide-react';
import { BrandShieldLogo } from './BrandShieldLogo';

interface PushNotificationBannerListProps {
  onNavigate?: (path: string) => void;
}

export const PushNotificationBannerList: React.FC<PushNotificationBannerListProps> = ({
  onNavigate,
}) => {
  const { notifications, removeNotification, brand } = useAppStore();

  return (
    <div className="absolute top-2 inset-x-3 z-50 pointer-events-none space-y-2 select-none">
      <AnimatePresence>
        {notifications.map((notif) => {
          const isUrgent = notif.type === 'urgent';
          const isWarning = notif.type === 'warning';
          const isSuccess = notif.type === 'success';

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={() => {
                if (notif.linkPath && onNavigate) {
                  onNavigate(notif.linkPath);
                }
                removeNotification(notif.id);
              }}
              className={`pointer-events-auto w-full p-3.5 rounded-3xl backdrop-blur-2xl border shadow-2xl cursor-pointer flex items-start gap-3 transition-transform active:scale-[0.98] ${
                isUrgent
                  ? 'bg-red-950/92 border-red-500/50 text-red-100 shadow-red-900/30'
                  : isWarning
                  ? 'bg-amber-950/92 border-amber-500/50 text-amber-100 shadow-amber-900/20'
                  : isSuccess
                  ? 'bg-[#0E151E]/95 border-emerald-500/40 text-slate-100 shadow-black/50'
                  : 'bg-[#0E151E]/95 border-white/10 text-slate-100 shadow-black/50'
              }`}
            >
              {/* Brand Shield / Icon Badge */}
              <div className="shrink-0 mt-0.5">
                {isUrgent ? (
                  <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <BrandShieldLogo brand={brand} size={20} />
                )}
              </div>

              {/* Banner Text Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold font-display uppercase tracking-wide truncate">
                    {notif.title}
                  </span>
                  <span className="text-[10px] font-mono-telemetry text-slate-400 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs opacity-90 leading-snug line-clamp-2 font-body">
                  {notif.body}
                </p>
              </div>

              {/* Dismiss X */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notif.id);
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
