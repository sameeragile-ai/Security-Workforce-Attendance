import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { Shield } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { brand, language, useEasternNumerals } = useAppStore();
  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';
  const brandName = isAman ? t.brandAman : t.brandNile;

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Count up 0 to 186
    const startTime = Date.now();
    const duration = 1200;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = Math.floor(progress * 186);
      setCounter(currentVal);

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 20);

    const timer = setTimeout(() => {
      onFinish();
    }, 1900);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#07090C] text-slate-100 select-none cursor-pointer overflow-hidden"
    >
      {/* Background Subtle Blueprint Grid */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30" />

      {/* Atmospheric Radial Ambient Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1.1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Central Tactical Shield Animation */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Animated Radar Sweep */}
        <div className="absolute -inset-10 rounded-full overflow-hidden pointer-events-none">
          <div
            className="w-full h-full animate-radar origin-center"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${accentColor} 360deg)`,
              opacity: 0.3,
            }}
          />
        </div>

        {/* Tactical Corner Brackets */}
        <div className="absolute -inset-4 pointer-events-none">
          <span className="absolute top-0 start-0 text-slate-600 font-mono-telemetry text-xs">⌜</span>
          <span className="absolute top-0 end-0 text-slate-600 font-mono-telemetry text-xs">⌝</span>
          <span className="absolute bottom-0 start-0 text-slate-600 font-mono-telemetry text-xs">⌞</span>
          <span className="absolute bottom-0 end-0 text-slate-600 font-mono-telemetry text-xs">⌟</span>
        </div>

        {/* Shield SVG with stroke drawing */}
        <svg
          width="88"
          height="100"
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M50 4L8 18V55C8 85 50 111 50 111C50 111 92 85 92 55V18L50 4Z"
            fill={isAman ? '#0B1626' : '#0A2E2C'}
            stroke={accentColor}
            strokeWidth="3.5"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
          <motion.text
            x="50"
            y="68"
            fill={accentColor}
            fontSize="46"
            fontWeight="700"
            fontFamily="'Barlow Condensed', sans-serif"
            textAnchor="middle"
            dominantBaseline="middle"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {isAman ? 'A' : 'N'}
          </motion.text>
        </svg>
      </div>

      {/* Brand Identity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center px-4"
      >
        <h1 className="text-2xl font-bold font-display tracking-wider text-slate-100 flex items-center justify-center gap-2">
          <span>{t.appName}</span>
          <span className="text-xs px-1.5 py-0.5 rounded border border-white/10 font-mono-telemetry text-slate-400">
            v2.4
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-body">{brandName}</p>
      </motion.div>

      {/* Countup Telemetry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="mt-6 flex items-center gap-2 text-xs font-mono-telemetry text-slate-400"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>
          {language === 'ar' ? (
            <>
              تأمين {formatNumber(14, language, useEasternNumerals)} موقعاً ·{' '}
              {formatNumber(counter, language, useEasternNumerals)} حارساً في الخدمة
            </>
          ) : (
            <>
              Securing {formatNumber(14, language, useEasternNumerals)} sites ·{' '}
              {formatNumber(counter, language, useEasternNumerals)} guards on watch
            </>
          )}
        </span>
      </motion.div>

      <span className="absolute bottom-6 text-[10px] text-slate-600 font-mono-telemetry">
        TAP ANYWHERE TO SKIP · Cairo EET
      </span>
    </div>
  );
};
