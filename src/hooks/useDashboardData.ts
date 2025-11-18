import { useQuery } from "@tanstack/react-query";
import {
  getMonthlySummary,
  getMonthlyPaymentMethods,
} from "../services/reportsService";
import {
  MonthlyReportSummary,
  MonthlyPaymentMethodsReport,
} from "../types/schema";
import { useTenant } from "../app/TenantProvider";

export const useDashboardData = (month: string) => {
  const { tenantId } = useTenant();

  const summaryQuery = useQuery<MonthlyReportSummary, Error>({
    queryKey: ["dashboard", "monthly-summary", month, tenantId],
    queryFn: () => getMonthlySummary(month),

    enabled: !!tenantId, // Only fetch if tenantId is available

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });


  // Debug logging to track data flow
  console.log("useDashboardData Debug:", {
    tenantId,
    month,
    queryKey: ["dashboard", "monthly-summary", month, tenantId],
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
    error: summaryQuery.error,
    data: summaryQuery.data,
    enabled: !!tenantId,
  });


  return summaryQuery;
  
};

export const useDashboardPaymentData = (month: string) => {
  const { tenantId } = useTenant();

    const paymentMethodsQuery = useQuery<MonthlyPaymentMethodsReport, Error>({
      queryKey: ["dashboard", "payment-methods", month, tenantId],
      queryFn: () => getMonthlyPaymentMethods(month),

      enabled: !!tenantId, // Only fetch if tenantId is available
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetch when window regains focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    });
    // Debug logging to track data flow
    console.log("usePaymentMethodsData Debug:", {
      tenantId,
      month,
      queryKey: ["dashboard", "payment-methods", month, tenantId],
      isLoading: paymentMethodsQuery.isLoading,
      isError: paymentMethodsQuery.isError,
      error: paymentMethodsQuery.error,
      data: paymentMethodsQuery.data,
      enabled: !!tenantId,
    });
    return paymentMethodsQuery;
}

