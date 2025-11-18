export function monthToRange(month: string) {
  // month = "YYYY-MM"
  const [y, m] = month.split('-').map(Number);
  const from = new Date(y, m - 1, 1, 0, 0, 0, 0); // first day of month
  const to = new Date(y, m, 1, 0, 0, 0, 0); // first day of next month
  return { from: from.toISOString(), to: to.toISOString() };
}

export function monthToPlainRange(month: string) {
  const [y, m] = month.split('-').map(Number);
  const from = `${y}-${String(m).padStart(2, '0')}-01`;
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  const to = `${ny}-${String(nm).padStart(2, '0')}-01`;
  return { from, to }; // plain dates, no timezone/Z
}

export function fmtDateTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString();
}

export function fmtMoney(n?: number | null, currency = 'EUR') {
  if (n == null) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
  } catch {
    return (n).toFixed(2);
  }
}

