import { useMemo, useState } from "react";
import { useDebounce } from "../utils/useDebounce";
import { DriverStatus } from "../types/schema";
import { useDriversData, DriversFilters } from "./useDriversData";



// Combines:
// - Search state with debouncing
// - Pagination logic
// - Filter management
// - Handler functions
// - Loading states


export const useDriversLogic = () => {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | DriverStatus>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const qDebounced = useDebounce(q, 400);

  const filters: DriversFilters = useMemo(
    () => ({
      q: qDebounced || undefined,
      status,
      page,
      pageSize,
    }),
    [qDebounced, status, page, pageSize]
  );

  const driversQuery = useDriversData(filters);

  const totalPages = useMemo(() => {
    if (!driversQuery.data) return 1;
    return Math.max(
      1,
      Math.ceil(driversQuery.data.total / driversQuery.data.pageSize)
    );
  }, [driversQuery.data?.total, driversQuery.data?.pageSize]);

  const handleSearchChange = (newQ: string) => {
    setQ(newQ);
    setPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (newStatus: "ALL" | DriverStatus) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return {
    // Search and filter state
    q,
    status,
    page,
    pageSize,
    totalPages,

    // Handlers
    handleSearchChange,
    handleStatusChange,
    handlePageChange,

    // Query result
    driversQuery,

    // Computed values
    isLoading: driversQuery.isLoading,
    isError: driversQuery.isError,
    error: driversQuery.error,
    data: driversQuery.data,

    // Loading states
    isFetching: driversQuery.isFetching,
    isPlaceholderData: driversQuery.isPlaceholderData,
  };
};
