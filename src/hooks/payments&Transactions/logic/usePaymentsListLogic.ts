import { useSearchParams } from "react-router-dom";
import { GetPaymentsQueryDto } from "../../../types/payments&Transactions";
import { usePaymentsListData } from "../usePayments&TransactionsData";
import { useCallback, useState } from "react";
import type { SortingState, Updater } from "@tanstack/react-table";

export function usePaymentsListLogic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null,
  );

  const filters = parseFiltersFromURL(searchParams);

  const { data, isLoading, isError } = usePaymentsListData(filters);

  const handleFilterChange = useCallback(
    (newFilters: Partial<GetPaymentsQueryDto>) => {
      const params = new URLSearchParams();

      // Merge current filters with new ones
      const merged = { ...filters, ...newFilters };

      // reset cursor/pagination wher filter change (exept when changing cursonr/pagination itself)
      if (!("cursor" in newFilters) && !("cursorDir" in newFilters)) {
        delete merged.cursor;
        delete merged.cursorDir;
      }

      // Add all non-empty values to URL
      Object.entries(merged).forEach(([Key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(Key, String(value));
        }
      });

      setSearchParams(params);
    },
    [filters, setSearchParams],
  );

  const handleFilterReset = useCallback(() => {
    setSearchParams(new URLSearchParams()); // clears all filters
  }, [setSearchParams]);

  const handleRowClick = useCallback((paymentId: string) => {
    setSelectedPaymentId(paymentId);
  }, []);

  const handleDraweClose = useCallback(() => {
    setSelectedPaymentId(null);
  }, []);

  // Derives current sorting state from URL for TanStack Table
  const currentSorting = filters.sortBy
    ? [{ id: filters.sortBy, desc: filters.sortDir === "desc" }]
    : [];

  // Handles sorting changes from TanStack Table
  const handleSortChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      // TanStack Table can pass either a value or an updater function
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(currentSorting)
          : updaterOrValue;

      if (newSorting.length > 0) {
        // Updates URL with new sort parameters
        handleFilterChange({
          sortBy: newSorting[0].id as GetPaymentsQueryDto["sortBy"],
          sortDir: newSorting[0].desc ? "desc" : "asc",
        });
      } else {
        // Clear sorting
        handleFilterChange({
          sortBy: undefined,
          sortDir: undefined,
        });
      }
    },
    [currentSorting, handleFilterChange],
  );

  // ✅ STEP 6: Handle pagination - Next Page
  const handleNextPage = useCallback(() => {
    if (data?.page.nextCursor) {
      handleFilterChange({
        cursor: data.page.nextCursor,
        cursorDir: "next",
      });
    }
  }, [data?.page.nextCursor, handleFilterChange]);

  // ✅ STEP 6: Handle pagination - Previous Page
  const handlePrevPage = useCallback(() => {
    if (data?.page.prevCursor) {
      handleFilterChange({
        cursor: data.page.prevCursor,
        cursorDir: "prev",
      });
    }
  }, [data?.page.prevCursor, handleFilterChange]);

  return {
    // Data
    data,
    isLoading,
    isError,

    // Drawer state (paymentId)
    selectedPaymentId,

    // Sorting state
    sorting: currentSorting,

    // handlers
    handleFilterChange,
    handleFilterReset,
    handleSortChange,
    handleRowClick,
    handleDraweClose,
    handleNextPage,
    handlePrevPage,

    // Pagination metadata
    pagination: {
      hasNext: data?.page.hasNext,
      hasPrev: data?.page.hasPrev,
      nextCursor: data?.page.nextCursor,
      prevCursor: data?.page.prevCursor,
      totalInPage: data?.page.totalInPage,
    },
  };
}

// this is a helper sunction to parse the URL search params into our GetPaymentsQueryDto format
function parseFiltersFromURL(params: URLSearchParams): GetPaymentsQueryDto {
  const filters: GetPaymentsQueryDto = {};

  if (params.has("from")) filters.from = params.get("from")!;
  if (params.has("to")) filters.to = params.get("to")!;
  if (params.has("status")) filters.status = params.get("status")!;
  if (params.has("provider")) filters.provider = params.get("provider")!;
  if (params.has("driverId")) filters.driverId = params.get("driverId")!;
  if (params.has("rideId")) filters.rideId = params.get("rideId")!;
  if (params.has("q")) filters.q = params.get("q")!;

  // Sorting
  if (params.has("sortBy"))
    filters.sortBy = params.get("sortBy") as GetPaymentsQueryDto["sortBy"];
  if (params.has("sortDir"))
    filters.sortDir = params.get("sortDir") as GetPaymentsQueryDto["sortDir"];

  // Pagination
  if (params.has("cursor")) filters.cursor = params.get("cursor")!;
  if (params.has("cursorDir"))
    filters.cursorDir = params.get(
      "cursorDir",
    ) as GetPaymentsQueryDto["cursorDir"];

  if (params.has("limit")) filters.limit = Number(params.get("limit")!);

  return filters;
}
