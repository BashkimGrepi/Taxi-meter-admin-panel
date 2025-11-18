import { useQuery } from "@tanstack/react-query";
import { listPayments } from "../services/paymentsService";
import { Page, Payment, PaymentProvider, PaymentStatus } from "../types/schema";
import { useTenant } from "../app/TenantProvider";

export interface PaymentsFilters {
  from: string;
  to: string;
  status: "ALL" | PaymentStatus;
  provider: "ALL" | PaymentProvider;
  page: number;
  pageSize: number;
}

export const usePaymentsData = (filters: PaymentsFilters) => {
  const { tenantId } = useTenant();
  return useQuery({
    queryKey: ["payments", filters, tenantId],
    queryFn: async (): Promise<Page<Payment>> => {
      const { status, provider, ...restFilters } = filters;

      const queryParams = {
        ...restFilters,
        ...(status !== "ALL" && { status }),
        ...(provider !== "ALL" && { provider }),
      };

      return listPayments(queryParams);
    },

    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error && typeof error === "object" && "status" in error) {
        const status = error.status as number;
        if (status >= 400 && status < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
