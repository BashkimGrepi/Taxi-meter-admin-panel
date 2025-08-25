import { useEffect, useMemo, useState } from 'react';
import { MonthlyReportSummary, Page, Payment, PaymentStatus, Ride, RideStatus } from '../types/schema';
import { monthToRange, fmtDateTime, fmtMoney } from '../utils/dates';
import { listRides } from '../services/ridesService';
import { listPayments } from '../services/paymentsService';
import { getMonthlySummary } from '../services/reportsService';
import MonthPicker from '../components/MonthPicker';
import { PaymentStatusBadge, RideStatusBadge } from '../components/Badges';
import { notify } from '../app/ToastBoundary';
import RideDetailDrawer from '../components/RideDetailDrawer';

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${y}-${m}`;
}

export default function Transactions() {
  const [month, setMonth] = useState(yyyyMm());
  const [status, setStatus] = useState<'ALL' | RideStatus>('ALL');
  const [pstatus, setPStatus] = useState<'ALL' | PaymentStatus>('ALL');

  const [rides, setRides] = useState<Page<Ride>>({ items: [], total: 0, page: 1, pageSize: 25 });
  const [payments, setPayments] = useState<Page<Payment>>({ items: [], total: 0, page: 1, pageSize: 9999 });
  const [summary, setSummary] = useState<MonthlyReportSummary | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const { from, to } = useMemo(() => monthToRange(month), [month]);

  // Load rides & payments for the month
  useEffect(() => {
    (async () => {
      try {
        const [r, p, s] = await Promise.all([
          listRides({ from, to, status, page, pageSize }),
          listPayments({ from, to, status: pstatus }),
          getMonthlySummary(month),
        ]);
        setRides(r);
        setPayments(p);
        setSummary(s);
      } catch (e: any) {
        notify.error(e?.message ?? 'Failed to load transactions');
      }
    })();
  }, [from, to, month, status, pstatus, page, pageSize]);

  // Index payments by rideId for fast lookup
  const payByRide = useMemo(() => {
    const map = new Map<string, Payment>();
    for (const p of payments.items) if (p.rideId) map.set(p.rideId, p);
    return map;
  }, [payments]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rides.total / rides.pageSize)),
    [rides.total, rides.pageSize]
  );

  function openDetails(r: Ride) {
    setSelectedRide(r);
    setDrawerOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Transactions</h1>
          <p className="text-gray-500 text-sm">Rides and terminal payments for the selected month.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">Rides</div>
          <div className="text-xl font-semibold">{summary?.ridesCount ?? rides.total}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">Completed ratio</div>
          <div className="text-xl font-semibold">
            {summary?.completedRatio != null ? `${Math.round((summary.completedRatio as number) * 100)}%` : '—'}
          </div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">Revenue (subtotal)</div>
          <div className="text-xl font-semibold">{fmtMoney(summary?.subtotal)}</div>
        </div>
        <div className="border rounded p-3">
          <div className="text-xs text-gray-500">Revenue (total)</div>
          <div className="text-xl font-semibold">{fmtMoney(summary?.total)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MonthPicker value={month} onChange={(m) => { setMonth(m); setPage(1); }} />
        <label className="text-sm">
          Ride status
          <select
            className="mt-1 w-full border rounded p-2"
            value={status}
            onChange={e => { setStatus(e.target.value as any); setPage(1); }}
          >
            <option value="ALL">All</option>
            <option value={RideStatus.COMPLETED}>Completed</option>
            <option value={RideStatus.ONGOING}>Ongoing</option>
            <option value={RideStatus.CREATED}>Created</option>
            <option value={RideStatus.CANCELLED}>Cancelled</option>
          </select>
        </label>
        <label className="text-sm">
          Payment status
          <select
            className="mt-1 w-full border rounded p-2"
            value={pstatus}
            onChange={e => setPStatus(e.target.value as any)}
          >
            <option value="ALL">All</option>
            <option value={PaymentStatus.PAID}>Paid</option>
            <option value={PaymentStatus.PENDING}>Pending</option>
            <option value={PaymentStatus.FAILED}>Failed</option>
            <option value={PaymentStatus.CANCELED}>Canceled</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm">
              <th className="px-3 py-2">Started</th>
              <th className="px-3 py-2">Ended</th>
              <th className="px-3 py-2">Driver</th>
              <th className="px-3 py-2">Fare total</th>
              <th className="px-3 py-2">Ride status</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {rides.items.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">No rides</td></tr>
            )}
            {rides.items.map(r => {
              const payment = payByRide.get(r.id);
              // If a payment status filter is active, hide rows that don't match
              if (pstatus !== 'ALL') {
                if (!payment || payment.status !== pstatus) return null;
              }
              return (
                <tr key={r.id} className="text-sm">
                  <td className="px-3 py-2">{fmtDateTime(r.startedAt)}</td>
                  <td className="px-3 py-2">{fmtDateTime(r.endedAt)}</td>
                  <td className="px-3 py-2">{r.driverProfileId ?? '—'}</td>
                  <td className="px-3 py-2">{fmtMoney(r.fareTotal)}</td>
                  <td className="px-3 py-2"><RideStatusBadge status={r.status} /></td>
                  <td className="px-3 py-2">
                    <PaymentStatusBadge status={payment?.status} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 rounded border hover:bg-gray-50" onClick={() => openDetails(r)}>
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">Total: {rides.total}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}>Prev</button>
          <span>{page} / {totalPages}</span>
          <button className="px-2 py-1 rounded border disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}>Next</button>
        </div>
      </div>

      <RideDetailDrawer
        open={drawerOpen}
        ride={selectedRide}
        payment={selectedRide ? payByRide.get(selectedRide.id) : null}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
