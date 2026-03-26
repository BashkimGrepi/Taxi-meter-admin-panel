import { useMemo } from "react";
import { useProfitTimelineData } from "../usePayments&TransactionsData";
import { ProfitGranularity } from "../../../types/payments&Transactions";

export function useProfitTimelineLogic(
  granularity: ProfitGranularity = ProfitGranularity.YEAR,
  fromDate?: string,
  toDate?: string,
) {
  const { data, isLoading, error } = useProfitTimelineData({
    granularity,
    fromDate,
    toDate,
  });

  // Transform API data into chart format
  const chartData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((point) => ({
      year: point.label, // Label format depends on granularity (e.g., "2023", "2023-01", etc.)
      revenue: parseFloat(point.profit || "0"),
    }));
  }, [data]);

  // Format total profit for display
  const totalProfit = useMemo(() => {
    if (!data?.total) return "€0.00";
    const value = parseFloat(data.total);
    return `€${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [data]);

  // Calculate growth percentage
  const growthPercentage = useMemo(() => {
    if (!chartData || chartData.length < 2) return "+0.0%";

    const lastValue = chartData[chartData.length - 1]?.revenue || 0;
    const previousValue = chartData[chartData.length - 2]?.revenue || 0;

    if (previousValue === 0) return "+0.0%";

    const growth = ((lastValue - previousValue) / previousValue) * 100;
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth.toFixed(1)}%`;
  }, [chartData]);

  return {
    // Data
    chartData,
    totalProfit,
    growthPercentage,

    // States
    isLoading,
    error,

    // Raw data in case needed
    rawData: data,
  };
}
