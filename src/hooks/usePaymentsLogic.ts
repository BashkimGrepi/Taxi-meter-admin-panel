import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePaymentsData, PaymentsFilters } from "./usePaymentsData";
import { monthToRange } from "../utils/dates";
import { Payment, PaymentProvider, PaymentStatus, Ride } from "../types/schema";
import { getRide } from "../services/ridesService";

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export const usePaymentsLogic = () => {
  // Filter state
  const [month, setMonth] = useState(yyyyMm());
  const [status, setStatus] = useState<"ALL" | PaymentStatus>("ALL");
  const [provider, setProvider] = useState<"ALL" | PaymentProvider>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  // Payment inspection state
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Compute date range from month
  const { from, to } = useMemo(() => monthToRange(month), [month]);

  // Build filters object
  const filters: PaymentsFilters = useMemo(
    () => ({
      from,
      to,
      status,
      provider,
      page,
      pageSize,
    }),
    [from, to, status, provider, page, pageSize]
  );

  // Fetch payments data
  const paymentsQuery = usePaymentsData(filters);

  // Fetch ride details for selected payment
  const rideQuery = useQuery({
    queryKey: ["ride", selectedPayment?.rideId],
    queryFn: () => getRide(selectedPayment!.rideId!),
    enabled: !!selectedPayment?.rideId && drawerOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Pagination calculations
  const totalPages = useMemo(() => {
    if (!paymentsQuery.data) return 1;
    return Math.max(
      1,
      Math.ceil(paymentsQuery.data.total / paymentsQuery.data.pageSize)
    );
  }, [paymentsQuery.data?.total, paymentsQuery.data?.pageSize]);

  // Handler functions
  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    setPage(1); // Reset to first page when month changes
  };

  const handleStatusChange = (newStatus: "ALL" | PaymentStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when status changes
  };

  const handleProviderChange = (newProvider: "ALL" | PaymentProvider) => {
    setProvider(newProvider);
    setPage(1); // Reset to first page when provider changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handleInspectPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPayment(null);
  };

  const handleOpenExport = () => {
    setExportOpen(true);
  };

  const handleCloseExport = () => {
    setExportOpen(false);
  };

  return {
    // Filter state
    month,
    status,
    provider,
    page,
    pageSize,
    totalPages,

    // Modal state
    drawerOpen,
    exportOpen,
    selectedPayment,

    // Data
    data: paymentsQuery.data,
    selectedRide: rideQuery.data,

    // Loading states
    isLoading: paymentsQuery.isLoading,
    isError: paymentsQuery.isError,
    error: paymentsQuery.error,
    isFetching: paymentsQuery.isFetching,
    isPlaceholderData: paymentsQuery.isPlaceholderData,

    // Ride loading state
    isLoadingRide: rideQuery.isLoading,

    // Handlers
    handleMonthChange,
    handleStatusChange,
    handleProviderChange,
    handlePageChange,
    handleInspectPayment,
    handleCloseDrawer,
    handleOpenExport,
    handleCloseExport,
  };
};
