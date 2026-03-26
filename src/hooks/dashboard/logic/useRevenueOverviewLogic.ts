import { useMemo } from "react";
import { RevenueOverviewResponse } from "../../../types/dashboard";

export const useRevenueOverviewLogic = (
  data: RevenueOverviewResponse | undefined,
  isLoading: boolean,
) => {
  const revenueData = useMemo(() => {
    if (!data) {
      return {
        fareSubtotal: 0,
        taxCollected: 0,
        totalRevenue: 0,
        avgRideValue: 0,
        //commission: 18, // Default commission percentage
        currency: "€",
        trend: undefined,
      };
    }

    // You can add trend calculation here if you have historical data
    // For now, using a placeholder
    const trend = {
      value: "+14%",
      type: "positive" as const,
    };

    return {
      fareSubtotal: data.totals.fareSubtotal,
      taxCollected: data.totals.taxAmount,
      totalRevenue: data.totals.fareTotal,
      avgRideValue: data.averages.avgFareTotal,
      //commission: 18, // This could come from the API if available
      currency: data.currency,
      trend,
    };
  }, [data]);

  return {
    revenueData,
    isLoading,
  };
};
