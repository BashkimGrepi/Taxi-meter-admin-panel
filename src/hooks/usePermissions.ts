import { useMemo } from "react";
import { useAuth } from "../app/AuthProvider";
import { Role } from "../types/schema";

// hooks/usePermissions.ts
export const usePermissions = () => {
  const { payload } = useAuth();

  const isAdminOrManager = useMemo(() => {
    const roles = new Set(payload?.memberships?.map((m) => m.role) ?? []);
    return (
      roles.has(Role.ADMIN) ||
      roles.has(Role.MANAGER) ||
      payload?.role === Role.ADMIN ||
      payload?.role === Role.MANAGER
    );
  }, [payload]);

  return { isAdminOrManager };
};
