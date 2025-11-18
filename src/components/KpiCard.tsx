

export default function KpiCard({
  label,
  value,
  hint,
  icon,
  iconColor = "text-slate-600",
  iconBg = "bg-slate-100",
  loading = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  loading?: boolean;
}) {
  return (
    <div >
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:border-slate-300">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>

        <div className="relative">
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              {label}
            </div>
            {icon && (
              <div
                className={`h-10 w-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shadow-sm`}
              >
                {icon}
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="text-3xl font-bold text-slate-900 leading-none">
                {value}
              </div>
            )}
          </div>

          {/* Hint */}
          {hint && (
            <div className="text-sm text-slate-500 font-medium">{hint}</div>
          )}

          {/* Trend indicator placeholder */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
            <span>Current period</span>
          </div>
        </div>
      </div>
    </div>
  );
}
