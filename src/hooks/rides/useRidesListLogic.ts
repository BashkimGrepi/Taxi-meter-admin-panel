import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { RidesQueryParams } from "../../types/rides";
import { useRidesData } from "./useRidesData";

/**
 * Custom hook for Rides page logic
 * - URL-driven filter state management
 * - Filter changes, sorting, pagination
 * - Drawer state for ride details
 */
export function useRidesListLogic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Parse filters from URL query params
  const filters = parseFiltersFromURL(searchParams);

  // Fetch rides data using React Query
  const { data, isLoading, isError, error } = useRidesData(filters);

  // Initialize default sort on first load (if no params)
  useEffect(() => {
    if (!hasInitialized.current && !searchParams.toString()) {
      hasInitialized.current = true;
      const params = new URLSearchParams();
      params.set("sortBy", "startedAt");
      params.set("sortDir", "desc");
      setSearchParams(params, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handle filter changes (updates URL)
  const handleFilterChange = useCallback(
    (newFilters: Partial<RidesQueryParams>) => {
      const params = new URLSearchParams();

      // Merge current filters with new ones
      const merged = { ...filters, ...newFilters };

      // Reset cursor/pagination when filters change (except when changing cursor itself)
      if (!("cursor" in newFilters) && !("cursorDir" in newFilters)) {
        delete merged.cursor;
        delete merged.cursorDir;
      }

      // Add all non-empty values to URL
      Object.entries(merged).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      setSearchParams(params);
    },
    [filters, setSearchParams],
  );

  // Handle filter reset (back to defaults)
  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    params.set("sortBy", "startedAt");
    params.set("sortDir", "desc");
    setSearchParams(params);
  }, [setSearchParams]);

  // Handle row click (opens drawer)
  // using useCallback to prevent unnecessary re-renders for extra optimization
  const handleRowClick = useCallback((rideId: string) => {
    setSelectedRideId(rideId);
  }, []);

  // Handle drawer close
  const handleDrawerClose = useCallback(() => {
    setSelectedRideId(null);
  }, []);

  // Handle sort (toggle direction if same column)
  const handleSort = useCallback(
    (sortBy: RidesQueryParams["sortBy"]) => {
      const currentSortBy = filters.sortBy;
      const currentSortDir = filters.sortDir || "desc";

      // Toggle direction if clicking same column
      const sortDir =
        currentSortBy === sortBy && currentSortDir === "desc" ? "asc" : "desc";

      handleFilterChange({ sortBy, sortDir });
    },
    [filters.sortBy, filters.sortDir, handleFilterChange],
  );

  // Handle pagination - next page
  const handleNext = useCallback(() => {
    if (data?.page.nextCursor) {
      handleFilterChange({
        cursor: data.page.nextCursor,
        cursorDir: "next",
      });
    }
  }, [data?.page.nextCursor, handleFilterChange]);

  // Handle pagination - previous page
  const handlePrev = useCallback(() => {
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
    error,
    filters,

    // Drawer state
    selectedRideId,

    // Handlers
    handleFilterChange,
    handleReset,
    handleRowClick,
    handleDrawerClose,
    handleSort,
    handleNext,
    handlePrev,

    // Computed flags
    hasNext: !!data?.page.nextCursor,
    hasPrev: !!data?.page.prevCursor,
  };
}

/**
 * Parse query params into RidesQueryParams
 */
function parseFiltersFromURL(params: URLSearchParams): RidesQueryParams {
  const filters: RidesQueryParams = {};

  // Simple string params
  if (params.has("from")) filters.from = params.get("from")!;
  if (params.has("to")) filters.to = params.get("to")!;
  if (params.has("status")) filters.status = params.get("status")!;
  if (params.has("paymentStatus"))
    filters.paymentStatus = params.get("paymentStatus")!;
  if (params.has("provider")) filters.provider = params.get("provider")!;
  if (params.has("method")) filters.method = params.get("method")!;
  if (params.has("driverId")) filters.driverId = params.get("driverId")!;
  if (params.has("q")) filters.q = params.get("q")!;
  if (params.has("cursor")) filters.cursor = params.get("cursor")!;

  // Sorting
  if (params.has("sortBy"))
    filters.sortBy = params.get("sortBy") as RidesQueryParams["sortBy"];
  if (params.has("sortDir"))
    filters.sortDir = params.get("sortDir") as RidesQueryParams["sortDir"];
  if (params.has("cursorDir"))
    filters.cursorDir = params.get(
      "cursorDir",
    ) as RidesQueryParams["cursorDir"];

  // Numeric
  if (params.has("limit")) filters.limit = Number(params.get("limit"));

  return filters;
}
