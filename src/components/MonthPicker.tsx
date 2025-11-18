type Props = {
  value: string;           // "YYYY-MM"
  onChange: (mm: string) => void;
  label?: string;
};

export default function MonthPicker({ value, onChange, label = 'Month' }: Props) {
  return (
    <label className="block text-sm font-medium text-slate-800">
      
      <div className="relative mt-1">
        {/* Calendar icon (decorative) */}
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        <input
          type="month"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2 text-slate-900 tabular-nums
                     outline-none transition
                     hover:border-slate-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                     disabled:opacity-60
                     dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400
                     dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
        />
      </div>
    </label>
  );
}
