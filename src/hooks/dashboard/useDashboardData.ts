import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useTenant } from "../../app/TenantProvider";
import {
  getBussinessStatus,
  getDriversActivity,
  getLiveOperations,
  getPaymentSummary,
  getPerformanceTrends,
  getRevenueOverview,
  query,
} from "../../services/Dashboard/dashboardService";

// Business Status
export const useBussinessStatus = (query: query) => {
  const { tenantId } = useTenant();

  const bussinessStatusQuery = useQuery({
    queryKey: ["dashboard", "business-status", query.period, tenantId],
    queryFn: () => getBussinessStatus(query),

    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      bussinessStatusQuery;
    console.log("[Business Status Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isEmpty: data && Object.keys(data).length === 0,
      error: error?.message,
      tenantId,
      period: query.period,
    });
  }, [
    bussinessStatusQuery.status,
    bussinessStatusQuery.isLoading,
    bussinessStatusQuery.data,
    tenantId,
    query.period,
  ]);

  return bussinessStatusQuery;
};

// revenue overview
export const useRevenueOverview = (query: query) => {
  const { tenantId } = useTenant();
  const revenueOverviewQuery = useQuery({
    queryKey: ["dashboard", "revenue-overview", query.period, tenantId],
    queryFn: () => getRevenueOverview(query),

    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      revenueOverviewQuery;
    console.log("[Revenue Overview Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isEmpty: Array.isArray(data) ? data.length === 0 : !data,
      error: error?.message,
      tenantId,
      period: query.period,
    });
  }, [
    revenueOverviewQuery.status,
    revenueOverviewQuery.isLoading,
    revenueOverviewQuery.data,
    tenantId,
    query.period,
  ]);

  return revenueOverviewQuery;
};

// paymens summary
export const usePaymentSummary = (query: query) => {
  const { tenantId } = useTenant();
  const paymentSummaryQuery = useQuery({
    queryKey: ["dashboard", "payment-summary", query.period, tenantId],
    queryFn: () => getPaymentSummary(query),

    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      paymentSummaryQuery;
    console.log("[Payment Summary Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isEmpty: Array.isArray(data) ? data.length === 0 : !data,
      error: error?.message,
      tenantId,
      period: query.period,
    });
  }, [
    paymentSummaryQuery.status,
    paymentSummaryQuery.isLoading,
    paymentSummaryQuery.data,
    tenantId,
    query.period,
  ]);

  return paymentSummaryQuery;
};

export const useLiveOperations = () => {
  const { tenantId } = useTenant();
  const liveOperationsQuery = useQuery({
    queryKey: ["dashboard", "live-operations", tenantId],
    queryFn: () => getLiveOperations(),
    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      liveOperationsQuery;
    const isString = typeof data === "string";
    console.log("[Live Operations Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isStringResponse: isString,
      isEmpty: Array.isArray(data) ? data.length === 0 : false,
      error: error?.message,
      tenantId,
    });
  }, [
    liveOperationsQuery.status,
    liveOperationsQuery.isLoading,
    liveOperationsQuery.data,
    tenantId,
  ]);

  return liveOperationsQuery;
};

export const useDriversActivity = () => {
  const { tenantId } = useTenant();
  const driverActivityQuery = useQuery({
    queryKey: ["dashboard", "driver-activity", tenantId],
    queryFn: () => getDriversActivity(),
    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      driverActivityQuery;
    console.log("[Drivers Activity Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isEmpty: Array.isArray(data) ? data.length === 0 : !data,
      error: error?.message,
      tenantId,
    });
  }, [
    driverActivityQuery.status,
    driverActivityQuery.isLoading,
    driverActivityQuery.data,
    tenantId,
  ]);

  return driverActivityQuery;
};

export const usePerformanceTrendsQuery = () => {
  const { tenantId } = useTenant();
  const performanceTrendsQuery = useQuery({
    queryKey: ["dashboard", "performance-trends", tenantId],
    queryFn: () => getPerformanceTrends(),
    enabled: !!tenantId, // Only fetch if tenantId is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Enable background refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });

  useEffect(() => {
    const { status, isLoading, isError, isFetching, data, error } =
      performanceTrendsQuery;
    console.log("[Performance Trends Query]", {
      status,
      isLoading,
      isError,
      isFetching,
      hasData: !!data,
      isEmpty: Array.isArray(data) ? data.length === 0 : !data,
      error: error?.message,
      tenantId,
    });
  }, [
    performanceTrendsQuery.status,
    performanceTrendsQuery.isLoading,
    performanceTrendsQuery.data,
    tenantId,
  ]);

  return performanceTrendsQuery;
};
