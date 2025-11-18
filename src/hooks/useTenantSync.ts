import { useEffect, useMemo } from "react";
import { useAuth } from "../app/AuthProvider";
import { useTenant } from "../app/TenantProvider";
import { useQueryClient } from "@tanstack/react-query";

export const useTenantSync = () => {
  const queryClient = useQueryClient();
  const { tenantId, tenant } = useTenant();

  // Sync tenant data when user logs in and tenantId becomes available
  useEffect(() => {
    if (tenantId) {
      console.log("Tenant switched to: ", tenantId, tenant?.name);

      queryClient.clear();
      console.log("Query cache cleared due to tenant switch.");
    }
  }, [tenantId, tenant?.name, queryClient]);

  return {
    tenantId,
    tenant,
    refreshTenantData: () => queryClient.clear()
  };
};
