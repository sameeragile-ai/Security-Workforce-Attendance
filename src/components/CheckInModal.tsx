import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/appStore';
import { isInsideGeofence } from '../lib/geo';
import { translations, formatNumber } from '../i18n';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  Flame,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { GUARD_AVATAR_URL } from '../data/seed';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const {
    brand,
    language,
    sites,
    selectedSiteId,
    guardLocation,
    isOnPost,
    checkIn,
    checkOut,
    triggerSOS,
    isSelfieRequired,
    completeSelfieVerification,
    isMockLocationDetected,
  } = useAppStore();

  const t = translations[language];
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  const { isInside, distanceMeters } = isInsideGeofence(
    guardLocation,
    { lat: activeSite.lat, lng: activeSite.lng },
    activeSite.radiusMeters
  );

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // SOS Hold state
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start real camera or fallback
  const startCamera = async () => {
    setCameraActive(true);
    setCameraError(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 480, height: 640 },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError(true);
      }
    } catch {
      setCameraError(true); // Fallback gracefully to simulated camera feed
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setVerifying(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen]);

  const handleCaptureAndVerify = () => {
    setVerifying(true);
    let progress = 10;
    setVerificationProgress(progress);

    const interval = setInterval(() => {
      progress += 15;
      setVerificationProgress(Math.min(progress, 97));

      if (progress >= 97) {
        clearInterval(interval);
        setTimeout(async () => {
          stopCamera();
          if (isSelfieRequired) {
            await completeSelfieVerification();
          } else {
            await checkIn('selfie');
          }
          onClose();
        }, 600);
      }
    }, 120);
  };

  // SOS Press-and-Hold (2000ms)
  const startSosHold = () => {
    setSosHoldProgress(0);
    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / 2000) * 100, 100);
      setSosHoldProgress(pct);

      if (pct >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        triggerSOS('Emergency SOS triggered from post action sheet');
        onClose();
      }
    }, 30);
  };

  const cancelSosHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setSosHoldProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm select-none p-0 sm:p-4">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="w-full max-w-md bg-[#0F141C] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 uppercase tracking-wide">
              {t.tabCheckIn}
            </h2>
            <p className="text-xs text-slate-400 font-body">
              {language === 'ar' ? activeSite.nameAr : activeSite.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Verification Viewfinder */}
        {cameraActive ? (
          <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 aspect-[3/4] mb-4 flex items-center justify-center">
            {cameraError ? (
              // Simulated Fallback Viewfinder
              <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-black">
                <img
                  src={GUARD_AVATAR_URL}
                  alt="Guard Simulated Preview"
                  className="w-48 h-48 rounded-full object-cover border-2 border-dashed border-amber-400/60 p-1 opacity-90 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] font-mono-telemetry text-amber-300 mt-3">
                  SIMULATED HIGH-RES SENSOR CAPTURE
                </span>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {/* Oval Face Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-48 h-64 rounded-[50%] border-2 transition-colors ${
                  verifying ? 'border-emerald-400 animate-pulse' : 'border-amber-400/80 border-dashed'
                }`}
              />
            </div>

            {/* Corner Brackets */}
            <span className="absolute top-3 start-3 text-amber-400 font-mono text-sm">⌜</span>
            <span className="absolute top-3 end-3 text-amber-400 font-mono text-sm">⌝</span>
            <span className="absolute bottom-3 start-3 text-amber-400 font-mono text-sm">⌞</span>
            <span className="absolute bottom-3 end-3 text-amber-400 font-mono text-sm">⌟</span>

            {/* Verification Progress Banner */}
            {verifying && (
              <div className="absolute bottom-4 inset-x-4 bg-black/85 backdrop-blur-md rounded-xl p-3 border border-emerald-500/40 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono-telemetry font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {verificationProgress >= 97 ? t.faceMatched : `${t.verifyingFace} ${verificationProgress}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-100"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {!verifying && (
              <div className="absolute bottom-4 inset-x-4 flex gap-2">
                <button
                  onClick={stopCamera}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-xs font-semibold text-slate-300"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleCaptureAndVerify}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-98"
                >
                  <Camera className="w-4 h-4" />
                  <span>Verify & Submit</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Geofence Status Pill */}
            <div
              className={`p-3 rounded-2xl border mb-4 flex items-start gap-2.5 ${
                isInside
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
              }`}
            >
              {isInside ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              )}
              <div className="text-xs">
                <p className="font-semibold">
                  {isInside ? t.perimeterStatusInside : t.perimeterStatusOutside} ({distanceMeters}m)
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {isInside ? t.insideSuccess : t.disabledReasonGeofence}
                </p>
              </div>
            </div>

            {/* Check-In Action Button (Disabled if outside) */}
            <div className="space-y-2 mb-5">
              {!isOnPost ? (
                <button
                  disabled={!isInside}
                  onClick={() => startCamera()}
                  className={`w-full h-14 rounded-2xl font-bold font-display uppercase tracking-wider text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isInside
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-98 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>{t.checkInAction}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => startCamera()}
                    className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-medium text-xs flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>{t.biometricVerification}</span>
                  </button>

                  <button
                    onClick={async () => {
                      await checkOut();
                      onClose();
                    }}
                    className="w-full h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{t.checkOutAction}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Urgent Press-and-Hold SOS Button (2 Seconds) */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-center mb-2">
                <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
                  {t.holdForSos}
                </span>
              </div>

              <div className="relative w-full overflow-hidden rounded-2xl">
                {/* Radial Progress Background */}
                <div
                  className="absolute inset-0 bg-red-600 transition-all duration-75"
                  style={{
                    width: `${sosHoldProgress}%`,
                    opacity: sosHoldProgress > 0 ? 0.9 : 0,
                  }}
                />

                <button
                  onMouseDown={startSosHold}
                  onMouseUp={cancelSosHold}
                  onMouseLeave={cancelSosHold}
                  onTouchStart={startSosHold}
                  onTouchEnd={cancelSosHold}
                  className="relative z-10 w-full h-14 bg-red-950/80 hover:bg-red-900/80 border border-red-500/40 text-red-200 font-bold font-display uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform"
                >
                  <Flame className="w-5 h-5 text-red-400 animate-pulse" />
                  <span>
                    {sosHoldProgress > 0
                      ? `HOLDING... ${Math.round(sosHoldProgress)}%`
                      : 'PRESS & HOLD FOR URGENT SOS'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
