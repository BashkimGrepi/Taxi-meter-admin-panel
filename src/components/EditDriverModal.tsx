import { useEffect, useState } from 'react';
import { DriverProfile, DriverStatus } from '../types/schema';
import { updateDriverProfile } from '../services/driversService';
import { notify } from '../app/ToastBoundary';

type Props = {
  open: boolean;
  driver: DriverProfile | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditDriverModal({ open, driver, onClose, onSaved }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [status, setStatus]       = useState<DriverStatus | ''>('');
  const [busy, setBusy]           = useState(false);

  useEffect(() => {
    if (!driver) return;
    setFirstName(driver.firstName ?? '');
    setLastName(driver.lastName ?? '');
    setPhone(driver.phone ?? '');
    setStatus(driver.status ?? '');
  }, [driver]);

  async function save() {
    if (!driver) return;
    setBusy(true);
    try {
      await updateDriverProfile(driver.id, {
        firstName, lastName, phone,
        status: (status || undefined) as DriverStatus | undefined,
      });
      notify.success('Driver updated');
      onSaved();
      onClose();
    } catch (e: any) {
      notify.error(e?.message ?? 'Failed to update driver');
    } finally {
      setBusy(false);
    }
  }

  if (!open || !driver) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit driver</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">Close</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            First name
            <input className="mt-1 w-full border rounded p-2"
                   value={firstName} onChange={e => setFirstName(e.target.value)} />
          </label>
          <label className="text-sm">
            Last name
            <input className="mt-1 w-full border rounded p-2"
                   value={lastName} onChange={e => setLastName(e.target.value)} />
          </label>
          <label className="text-sm col-span-2">
            Phone
            <input className="mt-1 w-full border rounded p-2"
                   value={phone} onChange={e => setPhone(e.target.value)} />
          </label>
          <label className="text-sm col-span-2">
            Status
            <select className="mt-1 w-full border rounded p-2"
                    value={status}
                    onChange={e => setStatus(e.target.value as DriverStatus | '')}>
              <option value="">(no change)</option>
              <option value={DriverStatus.INVITED}>INVITED</option>
              <option value={DriverStatus.ACTIVE}>ACTIVE</option>
              <option value={DriverStatus.INACTIVE}>INACTIVE</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded border">Cancel</button>
          <button onClick={save}
                  disabled={busy}
                  className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-60">
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
