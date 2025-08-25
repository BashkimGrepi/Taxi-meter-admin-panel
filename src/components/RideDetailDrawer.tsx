import { useEffect, useState } from 'react';
import { Payment, Ride } from '../types/schema';
import { getRide } from '../services/ridesService';
import { fmtDateTime, fmtMoney } from '../utils/dates';

export default function RideDetailDrawer({
  open, ride, payment, onClose,
}: {
  open: boolean;
  ride: Ride | null;
  payment?: Payment | null;
  onClose: () => void;
}) {
  const [freshRide, setFreshRide] = useState<Ride | null>(ride);

  useEffect(() => {
    let ok = true;
    async function load() {
      if (!ride) return;
      try { const r = await getRide(ride.id); if (ok) setFreshRide(r); }
      catch { setFreshRide(ride); }
    }
    if (open && ride) load();
    return () => { ok = false; };
  }, [open, ride]);

  const r = freshRide ?? ride;
  if (!open || !r) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-end">
      <div className="w-full max-w-lg h-full bg-white shadow-xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Ride details</h2>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">Close</button>
        </div>

        <div className="space-y-2 text-sm">
          <div><span className="text-gray-500">Ride ID:</span> {r.id}</div>
          <div><span className="text-gray-500">Driver:</span> {r.driverProfileId ?? '—'}</div>
          <div><span className="text-gray-500">Started:</span> {fmtDateTime(r.startedAt)}</div>
          <div><span className="text-gray-500">Ended:</span> {fmtDateTime(r.endedAt)}</div>
          <div><span className="text-gray-500">Duration:</span> {r.durationMin ?? '—'} min</div>
          <div><span className="text-gray-500">Distance:</span> {r.distanceKm ?? '—'} km</div>

          <div className="mt-4 font-medium">Fare</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Subtotal</div><div>{fmtMoney(r.fareSubtotal)}</div>
            <div className="text-gray-500">Tax</div><div>{fmtMoney(r.taxAmount)}</div>
            <div className="text-gray-500">Total</div><div>{fmtMoney(r.fareTotal)}</div>
          </div>

          <div className="mt-4 font-medium">Payment</div>
          {payment ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Provider</div><div>{payment.provider}</div>
              <div className="text-gray-500">Status</div><div>{payment.status}</div>
              <div className="text-gray-500">Amount</div><div>{fmtMoney(payment.amount, payment.currency)}</div>
              <div className="text-gray-500">Captured</div><div>{fmtDateTime(payment.capturedAt)}</div>
              <div className="text-gray-500">External ID</div><div>{payment.externalPaymentId ?? '—'}</div>
            </div>
          ) : (
            <div className="text-gray-500">No payment recorded for this ride.</div>
          )}
        </div>
      </div>
    </div>
  );
}
