import { useEffect, useState } from 'react';
import { saveBlob } from '../utils/download';
import { exportPaymentsPdf } from '../services/exportService';
import { notify } from '../app/ToastBoundary';

export default function ExportPaymentsModal({
  open,
  defaultMonth,
  onClose,
}: {
  open: boolean;
  defaultMonth: string;     // "YYYY-MM"
  onClose: () => void;
}) {
  const [month, setMonth] = useState(defaultMonth);
  const [annex, setAnnex] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setMonth(defaultMonth); }, [defaultMonth]);

  if (!open) return null;

  async function runExport() {
    setBusy(true);
    try {
      const { blob, filename } = await exportPaymentsPdf({ month, annex });
      saveBlob(blob, filename);
      notify.success(`Exported ${filename}`);
      onClose();
    } catch (e: any) {
      notify.error(e?.message ?? 'Export failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Export Payments (PDF)</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">Close</button>
        </div>

        <div className="space-y-4">
          <label className="text-sm block">
            Month
            <input
              type="month"
              className="mt-1 w-full border rounded p-2"
              value={month}
              onChange={e => setMonth(e.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={annex}
              onChange={e => setAnnex(e.target.checked)}
            />
            Include annex (ride facts & audit IDs)
          </label>

          <p className="text-xs text-gray-500">
            Scope: Simplified receipts only. Includes **PAID** payments for the selected month,
            VAT 10% before 2025-01-01 and 14% on/after. A JSON snapshot is archived server-side.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded border">Cancel</button>
          <button
            onClick={runExport}
            disabled={busy}
            className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-60"
          >
            {busy ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
