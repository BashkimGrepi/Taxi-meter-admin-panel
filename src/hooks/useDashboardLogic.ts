import { useMemo } from "react";
import { MonthlyReportSummary } from "../types/schema";
import { fmtMoney } from "../utils/dates";
import {
  Car,
  TrendingUp,
  DollarSign,
  BarChart3,
  LucideIcon,
} from "lucide-react";

export interface KpiCardData {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export const useDashboardLogic = (
  summary: MonthlyReportSummary | undefined,
  isLoading: boolean,
) => {
  const completionPercentage = useMemo(() => {
    const rate = summary?.completionRate;
    return rate ? `${parseFloat(rate).toFixed(1)}%` : "—";
  }, [summary?.completionRate]);

  const kpiCards: KpiCardData[] = useMemo(
    () => [
      {
        label: "Total Rides",
        value: summary?.totalRides ?? (isLoading ? "…" : "—"),
        icon: Car,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
      },
      {
        label: "Completion Rate",
        value: isLoading ? "…" : completionPercentage,
        icon: TrendingUp,
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
      },
      {
        label: "Total Revenue",
        value: isLoading
          ? "…"
          : fmtMoney(parseFloat(summary?.totalRevenue || "0")),
        icon: DollarSign,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-100",
      },
      {
        label: "Active Drivers",
        value: summary?.activeDrivers ?? (isLoading ? "…" : "—"),
        icon: BarChart3,
        iconColor: "text-indigo-600",
        iconBg: "bg-indigo-100",
      },
    ],
    [summary, isLoading, completionPercentage]
  );

  const formattedData = useMemo(
    () => ({
      totalRides: summary?.totalRides ?? 0,
      completionRate: completionPercentage,
      totalRevenue: fmtMoney(parseFloat(summary?.totalRevenue || "0")),
      activeDrivers: summary?.activeDrivers ?? 0,
      avgFarePerRide: fmtMoney(parseFloat(summary?.avgFarePerRide || "0")),
      totalDistance: summary?.totalDistance
        ? `${summary.totalDistance} km`
        : "—",
    }),
    [summary, completionPercentage]
  );

  return {
    kpiCards,
    formattedData,
    completionPercentage,
  };
};


