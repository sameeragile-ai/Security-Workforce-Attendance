import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n';
import { BrandId } from '../types';
import { BrandShieldLogo } from './BrandShieldLogo';
import {
  Smartphone,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';

interface LoginBindingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginBindingModal: React.FC<LoginBindingModalProps> = ({ isOpen, onClose }) => {
  const {
    brand,
    setBrand,
    language,
    currentUser,
  } = useAppStore();

  const t = translations[language];

  // Steps: 'credentials' -> 'otp' -> 'binding' -> 'success'
  const [step, setStep] = useState<'credentials' | 'otp' | 'binding' | 'success'>('credentials');
  const [nationalId, setNationalId] = useState('29408151201482');
  const [phoneNumber, setPhoneNumber] = useState('+20 102 489 1932');
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [bindingErrorDemo, setBindingErrorDemo] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#0F141C] border border-white/10 p-5 shadow-2xl overflow-hidden">
        {/* Mashrabiya Watermark */}
        <div className="absolute inset-0 bg-mashrabiya opacity-20 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Credentials & Brand Selector */}
        {step === 'credentials' && (
          <div className="space-y-4">
            <div className="text-center">
              <BrandShieldLogo brand={brand} size={48} className="mx-auto mb-2" />
              <h3 className="text-lg font-bold font-display uppercase tracking-wider text-slate-100">
                Wardiya Guard Sign-In
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Enter your Egyptian 14-digit National ID & registered phone
              </p>
            </div>

            {/* Brand Switcher Pills */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBrand('aman')}
                className={`py-2 px-2.5 rounded-2xl text-xs font-mono-telemetry font-bold border transition-all text-center ${
                  brand === 'aman'
                    ? 'bg-[#0B1626] border-amber-500 text-amber-300'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                Aman Guard
              </button>
              <button
                type="button"
                onClick={() => setBrand('nile')}
                className={`py-2 px-2.5 rounded-2xl text-xs font-mono-telemetry font-bold border transition-all text-center ${
                  brand === 'nile'
                    ? 'bg-[#0A2E2C] border-[#D4A857] text-[#D4A857]'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                Nile Facility
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono-telemetry uppercase text-slate-400 block mb-1">
                  14-Digit National ID (الرقم القومي)
                </label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-2.5 text-xs text-slate-100 font-mono-telemetry tracking-wider focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono-telemetry uppercase text-slate-400 block mb-1">
                  Mobile Number (رقم الهاتف)
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-2.5 text-xs text-slate-100 font-mono-telemetry focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              onClick={() => setStep('otp')}
              className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-xs shadow-lg active:scale-98 transition-transform flex items-center justify-center gap-1.5"
            >
              <span>Continue to OTP</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Step 2: 6-Digit OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div className="text-center">
              <KeyRound className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-base font-bold font-display uppercase tracking-wide text-slate-100">
                Security Verification Code
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Sent via SMS to {phoneNumber} (Demo code auto-filled)
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-10 h-12 rounded-xl bg-black/50 border border-amber-400/60 flex items-center justify-center font-mono-telemetry text-lg font-bold text-amber-300"
                >
                  {digit}
                </div>
              ))}
            </div>

            <p className="text-center text-[10px] font-mono-telemetry text-slate-500">
              Resend code in 48s · Carrier: Vodafone Egypt
            </p>

            <button
              onClick={() => setStep('binding')}
              className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-xs shadow-lg active:scale-98 transition-transform"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* Step 3: Device Binding */}
        {step === 'binding' && (
          <div className="space-y-4">
            <div className="text-center">
              <Smartphone className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-base font-bold font-display uppercase tracking-wide text-slate-100">
                Register & Bind Device
              </h3>
              <p className="text-xs text-slate-400 font-body">
                For anti-fraud prevention, your account is cryptographically bound to one physical phone.
              </p>
            </div>

            {bindingErrorDemo ? (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-red-300 font-mono-telemetry">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>DEVICE BINDING MISMATCH</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  This employee profile is already locked to device [Serial: AG-EGY-994]. Contact your operations supervisor to release binding before signing in on a new device.
                </p>
                <button
                  onClick={() => setBindingErrorDemo(false)}
                  className="text-[10px] font-mono-telemetry text-amber-300 underline mt-1"
                >
                  Switch back to authorized device
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono-telemetry space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">MODEL:</span>
                  <span>iPhone 15 Pro (iOS 18)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HARDWARE HASH:</span>
                  <span className="text-amber-400">SHA256:7B8F9A4C...01D8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SECURITY POST:</span>
                  <span>City Stars Mall Gate 3</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => setStep('success')}
                className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-xs shadow-lg active:scale-98 transition-transform"
              >
                Confirm Device Binding
              </button>

              <button
                onClick={() => setBindingErrorDemo(true)}
                className="w-full py-2 text-[10px] font-mono-telemetry text-slate-400 hover:text-slate-200 underline text-center"
              >
                Demo: Test "Device Already Bound" Error State
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div>
              <h3 className="text-base font-bold font-display uppercase text-slate-100">
                Device Bound & Authenticated
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Welcome on watch, Officer Mahmoud Abdel-Rahman. Shift telemetry initialized.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display uppercase tracking-wider text-xs shadow-lg"
            >
              Enter Wardiya Command
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
