import React from 'react';
import { useAppStore } from '../store/appStore';
import { translations, formatNumber } from '../i18n';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Check,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

export const SupervisorShiftsScreen: React.FC = () => {
  const {
    language,
    useEasternNumerals,
    requests,
    approveRequest,
  } = useAppStore();

  const t = translations[language];

  // 14-day attendance rate data with 95% target line
  const attendanceTrend = [
    { day: '19 Oct', rate: 94 },
    { day: '21 Oct', rate: 96 },
    { day: '23 Oct', rate: 93 },
    { day: '25 Oct', rate: 97 },
    { day: '27 Oct', rate: 95 },
    { day: '29 Oct', rate: 98 },
    { day: '31 Oct', rate: 92 },
    { day: '02 Nov', rate: 96 },
  ];

  return (
    <div className="space-y-4 pb-28 px-3.5 pt-2">
      <div>
        <h2 className="text-base font-bold font-display uppercase tracking-wider text-slate-100">
          {t.shiftSchedule}
        </h2>
        <p className="text-xs text-slate-400 font-body">
          24/7 Guard Allocation & Approval Board
        </p>
      </div>

      {/* 14-Day Attendance Compliance Trend (Recharts) */}
      <div className="p-4 rounded-3xl bg-[#0D1219] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold font-mono-telemetry uppercase tracking-wider text-slate-300">
              14-Day Attendance Compliance Rate
            </h3>
            <p className="text-[11px] text-slate-400">
              Target: 95.0% · Current: 96.2%
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-telemetry text-xs font-bold">
            96.2% ON-TIME
          </span>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis domain={[85, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#11151B',
                  borderColor: '#334155',
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
              <ReferenceLine y={95} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Target 95%', fill: '#F59E0B', fontSize: 9 }} />
              <Line type="monotone" dataKey="rate" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3, fill: '#22C55E' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-mono-telemetry uppercase tracking-wider text-slate-400">
          Pending Personnel Requests ({requests.filter((r) => r.status !== 'finance_approved').length})
        </span>

        {requests.map((req) => (
          <div
            key={req.id}
            className="p-3.5 rounded-2xl bg-[#0D1219] border border-white/10 flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {req.type === 'leave' ? 'Leave Request' : 'Salary Advance'} · {req.amountOrDays}
              </span>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{req.details}</p>
              <span className="text-[10px] font-mono-telemetry text-slate-500 mt-1 block">
                Submitted {req.dateSubmitted}
              </span>
            </div>

            {req.status === 'finance_approved' ? (
              <span className="text-xs font-mono-telemetry text-emerald-400 font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10">
                APPROVED ✓
              </span>
            ) : (
              <button
                onClick={() => approveRequest(req.id)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-telemetry text-xs font-bold flex items-center gap-1 active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Approve</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
