import { LucideIcon } from "lucide-react";

export interface KPICardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  badge?: {
    text: string;
    color: string;
  };
  progress?: number; // 0-100
  progressColor?: string;
  loading?: boolean;
}

export default function KPICard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  badge,
  progress,
  progressColor = "bg-blue-500",
  loading = false,
}: KPICardProps) {
  const getTrendColor = (type: "positive" | "negative" | "neutral") => {
    switch (type) {
      case "positive":
        return "text-emerald-600";
      case "negative":
        return "text-rose-600";
      default:
        return "text-slate-500";
    }
  };

  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      {/* Header: label + trend */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-medium text-gray-600">{label}</div>

        {/* Right side: trend OR badge */}
        <div className="shrink-0">
          {trend && (
            <div
              className={`text-sm font-semibold flex items-center gap-1 ${getTrendColor(trend.type)}`}
            >
              <span className="text-xs">
                {trend.type === "positive"
                  ? "↗"
                  : trend.type === "negative"
                    ? "↘"
                    : "→"}
              </span>
              {trend.value}
            </div>
          )}
          {!trend && badge && (
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${badge.color}`}
            >
              {badge.text}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse mb-2" />
      ) : (
        <div className="text-3xl font-bold text-gray-900 mb-2 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      )}

      {/* Subtitle or trend text */}
      <div className="flex items-center gap-2">
        <div className={`shrink-0 ${iconBg} ${iconColor} p-1.5 rounded-lg`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs text-gray-500">
          {trend?.type === "positive"
            ? "Trending up this period"
            : trend?.type === "negative"
              ? "Down this period"
              : "Steady performance"}
        </div>
      </div>

      {/* Optional progress */}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
