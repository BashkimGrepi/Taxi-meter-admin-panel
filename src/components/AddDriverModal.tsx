import { useEffect, useState } from "react";
import { DriverProfile } from "../types/schema";
import { notify } from "../app/ToastBoundary";
import { createDriverProfile } from "../services/driversService";



type Props = {
    open: boolean;
    driver: DriverProfile | null;
    onClose: () => void;
    onAdded: () => void;
}


export default function CreateDriverModal({ open, driver, onClose, onAdded }: Props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    
    async function save() {
        // Implementation for adding a driver goes here
        setBusy(true);
        try {
            await createDriverProfile({ firstName, lastName, phone, email });
            notify.success('Driver added');
            onAdded();
            onClose();
        } catch (e: any) {
            notify.error(e?.message ?? 'Failed to add driver');
        } finally {
            setBusy(false);
        }
    }
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Add driver</h2>
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
                    Email
                    <input className="mt-1 w-full border rounded p-2"
                           value={email} onChange={e => setEmail(e.target.value)} />
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
    )
}