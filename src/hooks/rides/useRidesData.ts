import { useQuery } from "@tanstack/react-query";
import { useTenant } from "../../app/TenantProvider";
import { RidesQueryParams } from "../../types/rides";
import {
  getRideDetails,
  getRidesList,
} from "../../services/rides/ridesService";

/**
 * Fetch rides list with filters, sorting, and pagination
 * Uses placeholderData to prevent table flicker during refetch
 */
export const useRidesData = (query?: RidesQueryParams) => {
  const { tenantId } = useTenant();

  const ridesQuery = useQuery({
    queryKey: [
      "rides",
      "list",
      tenantId,
      // Filters that change WHICH rides to fetch
      query?.status,
      query?.paymentStatus,
      query?.provider,
      query?.method,
      query?.driverId,
      query?.q,
      query?.from,
      query?.to,
      // Sorting
      query?.sortBy,
      query?.sortDir,
      query?.limit,
      // Pagination (cursor changes the page, not the dataset)
      query?.cursor,
      query?.cursorDir,
    ],
    queryFn: () => getRidesList(query),
    enabled: !!tenantId, // Only fetch if tenantId is available
    placeholderData: (previousData) => previousData, // Keep old data while fetching new (prevents flicker)
    staleTime: 2 * 60 * 1000, // 2 minutes (rides change frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false, // Don't refetch on window focus for admin tables

    
  });

  console.log("query:", query?.from);

  return ridesQuery;
};

/**
 * Fetch single ride detail
 * Only fetches when rideId is provided (for drawer)
 */
export const useRideDetail = (rideId: string | null) => {
  const { tenantId } = useTenant();

  const rideDetailsQuery = useQuery({
    queryKey: ["rides", "detail", tenantId, rideId],
    queryFn: () => getRideDetails(rideId!),
    enabled: !!tenantId && !!rideId, // Only fetch if both are available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  return rideDetailsQuery;
};
