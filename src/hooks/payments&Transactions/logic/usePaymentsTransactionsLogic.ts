import { useMemo } from "react";
import { usePaymentsAndTransactionsData } from "../usePayments&TransactionsData";
import { QueryParamsPeriod } from "../../../types/payments&Transactions";

export function usePaymentsTransactionsLogic(
  period: QueryParamsPeriod["period"] = "all_time",
) {
  const { data, isLoading, error } = usePaymentsAndTransactionsData({ period });

  // Transform API data into chart format
  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        name: "All Worth",
        value: parseFloat(data.fareTotal || "0"),
      },
      {
        name: "Tax Amount",
        value: parseFloat(data.taxAmount || "0"),
      },
      {
        name: "Total Net Worth",
        value: parseFloat(data.fareSubtotal || "0"),
      },
    ];
  }, [data]);

  // Format total net worth for display
  const totalNetWorth = useMemo(() => {
    if (!data) return "€0.00";
    const value = parseFloat(data.fareTotal || "0");
    return `€${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [data]);

  // Extract growth percentage from comparison field
  const growthPercentage = useMemo(() => {
    if (!data?.comparison) return "+0.0%";
    return data.comparison; // Assuming API returns format like "+5.2%"
  }, [data]);

  const statusCounts = useMemo(() => {
    if (!data) return { paid: 0, pending: 0, failed: 0 };
    return {
      paid: data.counts.byStatus.find((s) => s.status === "PAID")?.count || 0,
      pending:
        data.counts.byStatus.find((s) => s.status === "PENDING")?.count || 0,
      failed:
        data.counts.byStatus.find((s) => s.status === "FAILED")?.count || 0,
    };
  }, [data]);

  return {
    // Data
    chartData,
    totalNetWorth,
    growthPercentage,
    statusCounts,

    // States
    isLoading,
    error,

    // Raw data in case needed
    rawData: data,
  };
}
