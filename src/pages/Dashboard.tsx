import { useEffect, useMemo, useState } from 'react';
import KpiCard from '../components/KpiCard';
import MonthPicker from '../components/MonthPicker';
import { getMonthlySummary } from '../services/reportsService';
import { fmtMoney } from '../utils/dates';
import { MonthlyReportSummary } from '../types/schema';
import { Link } from 'react-router-dom';

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${y}-${m}`;
}

export default function Dashboard() {
  const [month, setMonth] = useState(yyyyMm());
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MonthlyReportSummary | null>(null);

  const completionPct = useMemo(() => {
    const v = typeof summary?.completedRatio === 'number' ? summary!.completedRatio! : null;
    return v == null ? '—' : `${Math.round(v * 100)}%`;
  }, [summary]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const s = await getMonthlySummary(month);
        setSummary(s);
      } finally {
        setLoading(false);
      }
    })();
  }, [month]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-neutral-50">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Key metrics for your company.</p>
        </div>

        <div className="flex items-center gap-3">
          <MonthPicker value={month} onChange={setMonth} />
          <Link
            to="/transactions"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition
                       hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 active:scale-[.99]"
          >
            View transactions
          </Link>
        </div>
      </div>

      {/* KPI Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">Overview · {month}</span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Rides" value={summary?.ridesCount ?? (loading ? '…' : '—')} />
            <KpiCard label="Completed ratio" value={loading ? '…' : completionPct} />
            <KpiCard label="Revenue (subtotal)" value={loading ? '…' : fmtMoney(summary?.subtotal)} />
            <KpiCard label="Revenue (total)" value={loading ? '…' : fmtMoney(summary?.total)} />
          </div>
        </div>
      </div>
    </div>
  );
}
