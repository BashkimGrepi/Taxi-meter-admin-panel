import { useQuery } from "@tanstack/react-query";
import { useTenant } from "../../app/TenantProvider";
import {
  getPaymentsAndTransactions,
  getPaymentsList,
  getProfitTimeline,
} from "../../services/payments&transactions.ts/paymentsTransactions.service";
import {
  GetPaymentsQueryDto,
  GetProfitTimelineQueryDto,
  QueryParamsPeriod,
} from "../../types/payments&Transactions";

export const usePaymentsAndTransactionsData = (query: QueryParamsPeriod) => {
  const { tenantId } = useTenant();

  const paymentsTransactionsQuery = useQuery({
    queryKey: ["payments-transactions", tenantId, query.period],
    queryFn: () => getPaymentsAndTransactions(query),

    enabled: !!tenantId, // Only fetch if tenantId is available
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    staleTime: 5 * 60 * 1000, // 5 minutes (payments/transactions don't change as frequently as rides)
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false, // Don't refetch on window focus for admin tables
  });

  return paymentsTransactionsQuery;
};

export const useProfitTimelineData = (query: GetProfitTimelineQueryDto) => {
  const { tenantId } = useTenant();

  const profitChartQuery = useQuery({
    queryKey: [
      "profit-timeline",
      tenantId,
      query.granularity,
      query.fromDate,
      query.toDate,
    ],
    queryFn: () => getProfitTimeline(query),
    enabled: !!tenantId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
  });

  return profitChartQuery;
};

export const usePaymentsListData = (query: GetPaymentsQueryDto) => {
  const { tenantId } = useTenant();

  const paymentsListQuery = useQuery({
    queryKey: [
      "payments-list",
      tenantId,
      query.from,
      query.to,

      query.status,
      query.provider,
      query.driverId,
      query.rideId,
      query.q,
      query.sortBy,
      query.sortDir,
      query.limit,
      query.cursor,
      query.cursorDir,
    ],
    queryFn: () => getPaymentsList(query),
    enabled: !!tenantId,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
  });

  return paymentsListQuery;
};
