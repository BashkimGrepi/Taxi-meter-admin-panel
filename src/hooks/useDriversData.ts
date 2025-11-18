import { useQuery } from "@tanstack/react-query";
import { listDrivers } from "../services/driversService";
import { DriverProfile, DriverStatus, Page } from "../types/schema";
import { useTenant } from "../app/TenantProvider";


// Automatically handles:
// - API calls with listDrivers()
// - Caching for 2 minutes (staleTime)
// - Automatic retries on failure
// - Background refetch on focus
// - Placeholder data while loading

export interface DriversFilters {
  q?: string;
  status?: DriverStatus | "ALL";
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const useDriversData = (filters: DriversFilters) => {
  const { q, status, page = 1, pageSize = 10, sort } = filters;
  const { tenantId } = useTenant();

  return useQuery<Page<DriverProfile>, Error>({
    queryKey: ["drivers", "list", { q, status, page, pageSize, sort, } , tenantId],
    queryFn: () =>
      listDrivers({
        q: q || undefined,
        status: status === "ALL" ? undefined : status,
        page,
        pageSize,
        sort,
      }),
    
    enabled: !!tenantId, // Only fetch if tenantId is available

    staleTime: 2 * 60 * 1000, // 2 minutes - drivers data changes less frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Keep previous data while loading new search results
    placeholderData: (previousData) => previousData,
    // Refetch when window regains focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
  });
};
