import React, { useState, useRef } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import { IncidentReport } from '../types';
import { formatTacticalCoordinates } from '../lib/geo';
import {
  AlertTriangle,
  Plus,
  Mic,
  Camera,
  MapPin,
  Clock,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  Flame,
  X,
  Play,
  Square,
} from 'lucide-react';

export const IncidentsScreen: React.FC = () => {
  const {
    brand,
    language,
    useEasternNumerals,
    incidents,
    sites,
    selectedSiteId,
    guardLocation,
    currentUser,
    addIncident,
    isOffline,
  } = useAppStore();

  const t = translations[language];
  const activeSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  const [modalOpen, setModalOpen] = useState(false);
  const [reportType, setReportType] = useState<IncidentReport['type']>('suspicious');
  const [severity, setSeverity] = useState<IncidentReport['severity']>('medium');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [photoAttached, setPhotoAttached] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio recording handlers
  const startRecording = async () => {
    setIsRecording(true);
    setAudioDuration(0);
    setHasVoiceNote(false);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      }
    } catch {
      // Graceful simulated recording fallback
    }

    timerRef.current = setInterval(() => {
      setAudioDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasVoiceNote(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !hasVoiceNote) return;

    await addIncident({
      title: description ? description.substring(0, 48) : 'Voice note incident report',
      titleAr: description ? description.substring(0, 48) : 'تقرير صوتي ميداني',
      type: reportType,
      description: description || 'Field voice recording attached with GPS timestamp.',
      siteId: activeSite.id,
      siteName: activeSite.name,
      lat: guardLocation.lat,
      lng: guardLocation.lng,
      severity,
      photoUrl: photoAttached ? activeSite.photoUrl : undefined,
      audioDurationSeconds: hasVoiceNote ? audioDuration : undefined,
      status: 'pending',
      reportedByName: currentUser.name,
    });

    // Reset and close
    setDescription('');
    setHasVoiceNote(false);
    setPhotoAttached(false);
    setModalOpen(false);
  };

  const typeLabels: Record<IncidentReport['type'], string> = {
    intrusion: t.intrusion,
    fire: t.fire,
    medical: t.medical,
    damage: t.damage,
    suspicious: t.suspicious,
    other: t.other,
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-2">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-100">
            {t.incidentReports}
          </h2>
          <p className="text-xs text-slate-400 font-body">
            {incidents.length} events logged · {activeSite.name}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="h-9 px-3.5 rounded-full font-display uppercase tracking-wider text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: accentColor, color: '#07090C' }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.newReport}</span>
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-2.5">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-3.5 rounded-2xl bg-[#0D1219] border border-white/10 shadow-sm relative overflow-hidden"
          >
            {/* Header / Severity Dot */}
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    inc.severity === 'critical'
                      ? 'bg-red-500 animate-ping'
                      : inc.severity === 'high'
                      ? 'bg-orange-500'
                      : inc.severity === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-blue-400'
                  }`}
                />
                <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
                  {typeLabels[inc.type]}
                </span>
              </div>
              <span className="text-[10px] font-mono-telemetry text-slate-500">
                {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-sm font-semibold text-slate-200 mb-1 leading-snug">
              {language === 'ar' ? inc.titleAr || inc.title : inc.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {inc.description}
            </p>

            {/* Audio Voice Note Indicator */}
            {inc.audioDurationSeconds && (
              <div className="mt-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-amber-300 font-mono-telemetry w-fit">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Voice Note ({inc.audioDurationSeconds}s)</span>
              </div>
            )}

            {/* Auto-Tagged Footer Telemetry */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-telemetry text-slate-500">
              <span className="truncate">{inc.siteName}</span>
              <span className="shrink-0 ms-2 text-slate-400">
                {inc.synced ? 'SYNCED' : 'SAVED OFFLINE'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Incident Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0F141C] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-display uppercase tracking-wide text-slate-100">
                {t.newReport}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Incident Type Grid */}
              <div>
                <label className="block text-[11px] font-mono-telemetry uppercase text-slate-400 mb-1.5">
                  {t.incidentType}
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['suspicious', 'intrusion', 'fire', 'medical', 'damage', 'other'] as const).map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setReportType(type)}
                        className={`py-2 px-2.5 rounded-xl text-xs text-start font-medium transition-colors ${
                          reportType === type
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {typeLabels[type]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Severity Selector */}
              <div>
                <label className="block text-[11px] font-mono-telemetry uppercase text-slate-400 mb-1.5">
                  {t.severity}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['low', 'medium', 'high', 'critical'] as const).map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`py-1.5 rounded-xl text-[11px] font-mono-telemetry uppercase font-bold transition-all ${
                        severity === sev
                          ? sev === 'critical'
                            ? 'bg-red-500 text-white'
                            : sev === 'high'
                            ? 'bg-orange-500 text-slate-950'
                            : 'bg-amber-400 text-slate-950'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description textarea */}
              <div>
                <label className="block text-[11px] font-mono-telemetry uppercase text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the observed activity, persons involved, and exact gate or zone..."
                  className="w-full rounded-2xl bg-black/40 border border-white/10 p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {/* Audio Note Recorder & Photo Attach */}
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-mono-telemetry text-xs font-bold flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Recording ({audioDuration}s)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startRecording}
                    className={`flex-1 py-2.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
                      hasVoiceNote
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>{hasVoiceNote ? `Voice Attached (${audioDuration}s)` : t.recordVoiceNote}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPhotoAttached(!photoAttached)}
                  className={`py-2.5 px-3 rounded-2xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    photoAttached
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>{photoAttached ? 'Photo ✓' : 'Photo'}</span>
                </button>
              </div>

              {/* Auto-Tagged Preview Telemetry Strip */}
              <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-[10px] font-mono-telemetry text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>SITE:</span>
                  <span className="text-slate-300">{activeSite.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>GPS:</span>
                  <span className="text-amber-400">
                    {formatTacticalCoordinates(guardLocation.lat, guardLocation.lng)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>OFFLINE QUEUE:</span>
                  <span className="text-slate-300">{isOffline ? 'ACTIVE' : 'DIRECT SYNC'}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-xs shadow-lg active:scale-98 transition-transform"
              >
                {t.submitReport}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
