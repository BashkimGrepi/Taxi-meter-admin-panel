import { useEffect, useMemo, useState } from 'react';
import { Page, Payment, PaymentProvider, PaymentStatus, Ride } from '../types/schema';
import { listPayments } from '../services/paymentsService';
import { fmtDateTime, fmtMoney, monthToRange } from '../utils/dates';
import MonthPicker from '../components/MonthPicker';
import { PaymentStatusBadge } from '../components/Badges';
import { notify } from '../app/ToastBoundary';
import RideDetailDrawer from '../components/RideDetailDrawer';
import { getRide } from '../services/ridesService';

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  return `${y}-${m}`;
}

export default function Payments() {
  const [month, setMonth] = useState(yyyyMm());
  const [status, setStatus] = useState<'ALL' | PaymentStatus>('ALL');
  const [provider, setProvider] = useState<'ALL' | PaymentProvider>('ALL');

  const [data, setData] = useState<Page<Payment>>({ items: [], total: 0, page: 1, pageSize: 25 });
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const { from, to } = useMemo(() => monthToRange(month), [month]);

  useEffect(() => {
    (async () => {
      try {
        const res = await listPayments({ from, to, status, provider, page, pageSize });
        setData(res);
      } catch (e: any) {
        notify.error(e?.message ?? 'Failed to load payments');
      }
    })();
  }, [from, to, status, provider, page, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.total / data.pageSize)),
    [data.total, data.pageSize]
  );

  async function inspect(p: Payment) {
    setSelectedPayment(p);
    setDrawerOpen(true);
    setSelectedRide(null);
    try {
      if (p.rideId) {
        const r = await getRide(p.rideId);
        setSelectedRide(r);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Payments</h1>
          <p className="text-gray-500 text-sm">Read-only log of terminal payments captured on device.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <MonthPicker value={month} onChange={(m) => { setMonth(m); setPage(1); }} />
        <label className="text-sm">
          Status
          <select
            className="mt-1 w-full border rounded p-2"
            value={status}
            onChange={e => { setStatus(e.target.value as any); setPage(1); }}
          >
            <option value="ALL">All</option>
            <option value={PaymentStatus.PAID}>Paid</option>
            <option value={PaymentStatus.PENDING}>Pending</option>
            <option value={PaymentStatus.FAILED}>Failed</option>
            <option value={PaymentStatus.CANCELED}>Canceled</option>
          </select>
        </label>
        <label className="text-sm">
          Provider
          <select
            className="mt-1 w-full border rounded p-2"
            value={provider}
            onChange={e => { setProvider(e.target.value as any); setPage(1); }}
          >
            <option value="ALL">All</option>
            <option value={PaymentProvider.VIVA}>Viva</option>
            <option value={PaymentProvider.STRIPE}>Stripe</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm">
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Ride</th>
              <th className="px-3 py-2">External ID</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.items.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">No payments</td></tr>
            )}
            {data.items.map(p => (
              <tr key={p.id} className="text-sm">
                <td className="px-3 py-2">{fmtDateTime(p.createdAt ?? p.capturedAt)}</td>
                <td className="px-3 py-2">{p.provider}</td>
                <td className="px-3 py-2"><PaymentStatusBadge status={p.status} /></td>
                <td className="px-3 py-2">{fmtMoney(p.amount, p.currency)}</td>
                <td className="px-3 py-2">{p.rideId ?? '—'}</td>
                <td className="px-3 py-2">{p.externalPaymentId ?? '—'}</td>
                <td className="px-3 py-2 text-right">
                  <button className="px-2 py-1 rounded border hover:bg-gray-50" onClick={() => inspect(p)}>
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">Total: {data.total}</div>
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
        payment={selectedPayment}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
