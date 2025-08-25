export function monthToRange(month: string) {
  // month = "YYYY-MM"
  const [y, m] = month.split('-').map(Number);
  const from = new Date(y, m - 1, 1, 0, 0, 0, 0);
  const to = new Date(y, m, 1, 0, 0, 0, 0); // first day of next month
  return { from: from.toISOString(), to: to.toISOString() };
}

export function fmtDateTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString();
}

export function fmtMoney(n?: number | null, currency = 'EUR') {
  if (n == null) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n / 100);
  } catch {
    return (n / 100).toFixed(2);
  }
}
