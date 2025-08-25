//export default function AddDriver() {
  //return (
    //<div>
      //<h1 className="text-xl font-semibold mb-2">Add Driver</h1>
      //<p className="text-gray-600 text-sm">Driver invitation form will be here (Phase 3).</p>
    //</div>
  //);
//}

import { useEffect, useMemo, useState } from 'react';
import { DriverProfile, DriverStatus, Page } from '../types/schema';
import { listDrivers } from '../services/driversService';
import { useDebounce } from '../utils/useDebounce';
import { notify } from '../app/ToastBoundary';
import EditDriverModal from '../components/EditDriverModal';
import DriverRowStatus from '../components/DriverRowStatus';

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
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Drivers</h1>
          <p className="text-gray-500 text-sm">Manage your company’s drivers.</p>
        </div>
        <a href="/drivers/add" className="px-3 py-2 rounded bg-black text-white">Add driver</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          Search
          <input
            className="mt-1 w-full border rounded p-2"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1); }}
            placeholder="Name, phone, email…"
          />
        </label>
        <label className="text-sm">
          Status
          <select
            className="mt-1 w-full border rounded p-2"
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

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Linked user</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr><td className="px-3 py-6 text-center text-sm text-gray-500" colSpan={6}>Loading…</td></tr>
            )}
            {!loading && data.items.length === 0 && (
              <tr><td className="px-3 py-6 text-center text-sm text-gray-500" colSpan={6}>No drivers</td></tr>
            )}
            {!loading && data.items.map(d => (
              <tr key={d.id} className="text-sm">
                <td className="px-3 py-2">{d.firstName} {d.lastName}</td>
                <td className="px-3 py-2">{d.phone ?? '—'}</td>
                <td className="px-3 py-2">{d.email ?? '—'}</td>
                <td className="px-3 py-2"><DriverRowStatus status={d.status} /></td>
                <td className="px-3 py-2">{d.userId ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => openEdit(d)}
                    className="px-2 py-1 rounded border hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Total: {data.total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span>{page} / {totalPages}</span>
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
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
