import { useEffect, useMemo, useState } from 'react';
import { DriverProfile, DriverStatus, Page } from '../types/schema';
import { listDrivers } from '../services/driversService';
import { useDebounce } from '../utils/useDebounce';
import { notify } from '../app/ToastBoundary';
import EditDriverModal from '../components/EditDriverModal';
import DriverRowStatus from '../components/DriverRowStatus';
import { Pencil } from 'lucide-react';

export default function Drivers() {
  const [data, setData] = useState<Page<DriverProfile>>({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'ALL' | DriverStatus>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [selected, setSelected] = useState<DriverProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const qDebounced = useDebounce(q, 400);

  async function fetch() {
    setLoading(true);
    try {
      const res = await listDrivers({ q: qDebounced || undefined, status, page, pageSize });
      setData(res);
    } catch (e: any) {
      notify.error(e?.message ?? 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void fetch(); }, [qDebounced, status, page, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(data.total / data.pageSize)),
    [data.total, data.pageSize]
  );

  function openEdit(d: DriverProfile) {
    setSelected(d);
    setModalOpen(true);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Drivers</h1>
          <p className="text-sm text-slate-500">Manage your company’s drivers.</p>
        </div>
        <a
          href="/drivers/add"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[.98]"
        >
          Add driver
        </a>
      </div>

      {/* Filters (kept in the same place) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm font-medium text-slate-800">
          Search
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Name, phone, email…"
          />
        </label>
        <label className="text-sm font-medium text-slate-800">
          Status
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            value={status}
            onChange={e => { setStatus(e.target.value as any); setPage(1); }}
          >
            <option value="ALL">All</option>
            <option value={DriverStatus.INVITED}>Invited</option>
            <option value={DriverStatus.ACTIVE}>Active</option>
            <option value={DriverStatus.INACTIVE}>Inactive</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full">
          <thead className="bg-slate-900">
            <tr className="text-left text-sm text-white">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Phone</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Linked user</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={6}>Loading…</td>
              </tr>
            )}

            {!loading && data.items.length === 0 && (
              <tr>
                <td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={6}>No drivers</td>
              </tr>
            )}

            {!loading && data.items.map((d, idx) => (
              <tr
                key={d.id}
                className={`text-sm transition ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/70'
                } hover:bg-blue-100/60`}
              >
                <td className="px-5 py-3 text-slate-800">{d.firstName} {d.lastName}</td>
                <td className="px-5 py-3 text-slate-800">{d.phone ?? '—'}</td>
                <td className="px-5 py-3 text-slate-800">{d.email ?? '—'}</td>
                <td className="px-5 py-3"><DriverRowStatus status={d.status} /></td>
                <td className="px-5 py-3">{d.userId ? 'Yes' : 'No'}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(d)}
                      className="inline-flex items-center justify-center rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {/* If you later add delete logic, drop a red icon button next to edit to match the screenshot */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-600">
          Total: {data.total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="tabular-nums">{page} / {totalPages}</span>
          <button
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <EditDriverModal
        open={modalOpen}
        driver={selected}
        onClose={() => setModalOpen(false)}
        onSaved={() => void fetch()}
      />
    </div>
  );
}
