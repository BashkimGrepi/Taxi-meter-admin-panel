import { useQuery } from "@tanstack/react-query";
import { getTenant } from "../services/tenantService";
import { Membership, Tenant } from "../types/schema";

export interface TenantWithMembership {
  membership: Membership;
  tenant: Tenant | null;
}

export const useTenantData = (memberships: Membership[] | undefined) => {
  return useQuery({
    queryKey: ["tenants", memberships?.map((m) => m.tenantId).sort()],
    queryFn: async (): Promise<TenantWithMembership[]> => {
      if (!memberships || memberships.length === 0) {
        return [];
      }

      const tenantPromises = memberships.map(
        async (membership): Promise<TenantWithMembership> => {
          try {
            const tenant = await getTenant(membership.tenantId);
            return { membership, tenant };
          } catch (error) {
            console.warn(
              `Failed to fetch tenant ${membership.tenantId}:`,
              error
            );
            return { membership, tenant: null };
          }
        }
      );

      return Promise.all(tenantPromises);
    },
    enabled: !!memberships && memberships.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404s (tenant not found)
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
