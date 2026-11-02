import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import {
  MessageSquare,
  Radio,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  User,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { SUPERVISOR_AVATAR_URL, GUARD_AVATAR_URL } from '../data/seed';

export const MessagesScreen: React.FC = () => {
  const {
    brand,
    language,
    useEasternNumerals,
    broadcasts,
    urgentAlert,
    acknowledgeBroadcast,
    acknowledgeUrgentLevel,
    resetSOS,
    currentUser,
  } = useAppStore();

  const t = translations[language];
  const isAman = brand === 'aman';
  const accentColor = isAman ? '#FFB020' : '#D4A857';

  const [activeTab, setActiveTab] = useState<'broadcasts' | 'urgent' | 'supervisor'>('broadcasts');
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'Tarek El-Shazly (Supervisor)',
      text: 'Mahmoud, ensure Gate 3 barrier stays down between 02:00 and 04:00 for scheduled delivery.',
      time: '01:45 AM',
      isMe: false,
    },
    {
      id: 'm2',
      sender: 'Mahmoud Abdel-Rahman',
      text: 'Acknowledged captain. Delivery manifest checked with logistics desk.',
      time: '01:48 AM',
      isMe: true,
    },
  ]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: currentUser.name,
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      },
    ]);
    setInputText('');
  };

  return (
    <div className="space-y-4 pb-24 px-3.5 pt-2">
      {/* Messages Header */}
      <div>
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-100">
          {t.tabMessages}
        </h2>
        <p className="text-xs text-slate-400 font-body">
          Tactical Operations Channels & Live Escalation
        </p>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`flex-1 py-1.5 rounded-xl transition-all font-mono-telemetry uppercase text-[11px] ${
            activeTab === 'broadcasts'
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.broadcasts}
        </button>
        <button
          onClick={() => setActiveTab('urgent')}
          className={`flex-1 py-1.5 rounded-xl transition-all font-mono-telemetry uppercase text-[11px] flex items-center justify-center gap-1.5 ${
            activeTab === 'urgent'
              ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span>{t.urgent}</span>
          {urgentAlert.active && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('supervisor')}
          className={`flex-1 py-1.5 rounded-xl transition-all font-mono-telemetry uppercase text-[11px] ${
            activeTab === 'supervisor'
              ? 'bg-white/10 text-slate-100 font-bold border border-white/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.supervisorChat}
        </button>
      </div>

      {/* 1. Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-3">
          {broadcasts.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-amber-400">
                  {b.priority === 'high' ? 'HIGH PRIORITY NOTICE' : 'OPERATIONS BULLETIN'}
                </span>
                <span className="text-[10px] font-mono-telemetry text-slate-500">
                  {b.timestamp}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 mb-1.5 font-display">
                {language === 'ar' ? b.titleAr : b.title}
              </h3>
              <p className="text-xs text-slate-400 font-body leading-relaxed mb-3">
                {language === 'ar' ? b.contentAr : b.content}
              </p>

              {/* Acknowledge Button & Stats */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                <span className="text-[10px] font-mono-telemetry text-slate-500">
                  {formatNumber(b.ackCount, language, useEasternNumerals)} /{' '}
                  {formatNumber(b.totalRecipients, language, useEasternNumerals)} ACKNOWLEDGED
                </span>

                {b.acknowledged ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono-telemetry font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.acknowledged}</span>
                  </span>
                ) : (
                  <button
                    onClick={() => acknowledgeBroadcast(b.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-telemetry text-xs font-bold shadow-md active:scale-95 transition-transform"
                  >
                    {t.acknowledge}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Urgent Escalation Chain Tab */}
      {activeTab === 'urgent' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#140D0E] border border-red-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-red-300">
                  {t.urgentEscalation}
                </h3>
              </div>
              {urgentAlert.active && (
                <button
                  onClick={resetSOS}
                  className="text-[10px] font-mono-telemetry text-slate-400 hover:text-slate-200 underline"
                >
                  Resolve Alert
                </button>
              )}
            </div>

            <p className="text-xs text-red-200/80 mb-4 leading-relaxed font-body">
              {urgentAlert.active
                ? `ACTIVE ALARM at ${urgentAlert.siteName}: ${urgentAlert.reason}`
                : 'No active alarms. Standard 3-stage supervisor escalation protocol ready.'}
            </p>

            {/* Escalation Steps Timeline */}
            <div className="space-y-3 relative before:absolute before:top-3 before:bottom-3 before:start-4 before:w-0.5 before:bg-white/10">
              {urgentAlert.levels.map((lvl) => {
                const isAcked = lvl.status === 'acknowledged';

                return (
                  <div key={lvl.level} className="relative flex items-start gap-3 ps-1">
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-mono-telemetry text-xs font-bold border ${
                        isAcked
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : urgentAlert.active
                          ? 'bg-red-500 text-white border-red-400 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-white/10'
                      }`}
                    >
                      {lvl.level}
                    </div>

                    <div className="flex-1 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">
                          {language === 'ar' ? lvl.roleAr : lvl.role}
                        </span>
                        <span className="text-[10px] font-mono-telemetry text-slate-400">
                          {isAcked ? 'ACKNOWLEDGED' : `${lvl.countdownSeconds}s SLA`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{lvl.name}</p>

                      {urgentAlert.active && !isAcked && (
                        <button
                          onClick={() => acknowledgeUrgentLevel(lvl.level)}
                          className="mt-2 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono-telemetry text-[11px] font-bold"
                        >
                          Acknowledge Response
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Supervisor Threaded Chat Tab */}
      {activeTab === 'supervisor' && (
        <div className="flex flex-col h-[400px] rounded-3xl bg-[#0D1219] border border-white/10 overflow-hidden">
          {/* Thread Header */}
          <div className="p-3 border-b border-white/5 flex items-center gap-2.5 bg-black/20">
            <img
              src={SUPERVISOR_AVATAR_URL}
              alt="Supervisor"
              className="w-8 h-8 rounded-full object-cover border border-amber-400/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-bold text-slate-200">Tarek El-Shazly</p>
              <p className="text-[10px] font-mono-telemetry text-emerald-400">ONLINE · AREA SUPERVISOR</p>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 space-y-2.5 overflow-y-auto no-scrollbar">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                    msg.isMe
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-white/10 text-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] font-mono-telemetry text-slate-500 mt-0.5 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-2 border-t border-white/5 bg-black/40 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to supervisor..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
