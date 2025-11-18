import React, { useState } from 'react';

const MONEY_2DP = /^(?:\d+)(?:\.\d{1,2})?$/;
const MONEY_4DP = /^(?:\d+)(?:\.\d{1,4})?$/;

type FormValues = {
  name: string;
  baseFare: string; // currency
  perKm: string;    // price per km
};

export default function PricingPolicyForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: {
  initial?: Partial<FormValues>;
  onSubmit: (vals: FormValues) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}) {
  const [vals, setVals] = useState<FormValues>({
    name: initial?.name ?? '',
    baseFare: initial?.baseFare ?? '',
    perKm: initial?.perKm ?? '',
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleChange<K extends keyof FormValues>(key: K, v: string) {
    setVals(s => ({ ...s, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Basic client-side validation to match BE expectations
    if (!vals.name.trim()) return setErr('Name is required');
    if (!MONEY_2DP.test(vals.baseFare)) return setErr('Base fare must be a number with up to 2 decimals');
    if (!MONEY_4DP.test(vals.perKm)) return setErr('Per km must be a number with up to 4 decimals');

    setBusy(true);
    setErr(null);
    try {
      await onSubmit(vals);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to save');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {err && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700">{err}</div>}

      <label className="block">
        <div className="text-sm text-gray-600">Name</div>
        <input
          className="mt-1 w-full rounded border p-2"
          value={vals.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="Standard"
          required
        />
      </label>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block">
          <div className="text-sm text-gray-600">Base fare (EUR)</div>
          <input
            className="mt-1 w-full rounded border p-2"
            value={vals.baseFare}
            onChange={e => handleChange('baseFare', e.target.value)}
            placeholder="3.90"
            inputMode="decimal"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Per km (EUR/km)</div>
          <input
            className="mt-1 w-full rounded border p-2"
            value={vals.perKm}
            onChange={e => handleChange('perKm', e.target.value)}
            placeholder="1.2000"
            inputMode="decimal"
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded border px-3 py-1.5">
          Cancel
        </button>
        <button disabled={busy} className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-50">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
