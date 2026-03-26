import { useEffect, useRef } from "react";
import { useTenant } from "../app/TenantProvider";
import { useQueryClient } from "@tanstack/react-query";

export const useTenantSync = () => {
  const queryClient = useQueryClient();
  const { tenantId, tenant } = useTenant();
  const prevTenantIdRef = useRef<string | null>(tenantId);

  // Only invalidate cache when tenant actually switches (not on initial mount/login)
  useEffect(() => {
    if (
      tenantId &&
      prevTenantIdRef.current &&
      prevTenantIdRef.current !== tenantId
    ) {
      console.log(
        "Tenant switched from",
        prevTenantIdRef.current,
        "to",
        tenantId,
        tenant?.name,
      );

      // Invalidate tenant-specific queries instead of clearing everything
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return [
            "dashboard",
            "drivers",
            "rides",
            "payments",
            "transactions",
          ].includes(key as string);
        },
      });
    }

    prevTenantIdRef.current = tenantId;
  }, [tenantId, tenant?.name, queryClient]);

  return {
    tenantId,
    tenant,
  };
};
