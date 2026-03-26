import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Tenant } from "../types/schema";
import { getTenant as apiGetTenant } from "../services/tenantService";
import {
  getStoredTenantId,
  setStoredTenantId,
} from "../services/AxiosInstance";
import { useAuth } from "./AuthProvider";

type TenantCtx = {
  tenantId: string | null;
  tenant: Tenant | null;
  setTenantId: (id: string | null) => void;
  refresh: () => Promise<void>;
};

const TenantContext = createContext<TenantCtx | null>(null);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { payload } = useAuth();
  const [tenantId, setTenantIdState] = useState<string | null>(() =>
    getStoredTenantId(),
  );
  const [tenant, setTenant] = useState<Tenant | null>(null);

  function setTenantId(id: string | null) {
    setTenantIdState(id);
    setStoredTenantId(id);
  }

  async function refresh() {
    if (!tenantId) {
      setTenant(null);
      return;
    }
    try {
      const t = await apiGetTenant(tenantId);
      setTenant(t);
    } catch {
      setTenant(null);
    }
  }

  // Sync tenantId when AuthProvider's token changes
  useEffect(() => {
    const tokenTenantId = payload?.tenantId ?? null;
    if (tokenTenantId !== tenantId) {
      setTenantIdState(tokenTenantId);
      setStoredTenantId(tokenTenantId);
    }
  }, [payload?.tenantId]);

  useEffect(() => {
    void refresh();
  }, [tenantId]);

  const value: TenantCtx = useMemo(
    () => ({
      tenantId,
      tenant,
      setTenantId,
      refresh,
    }),
    [tenantId, tenant],
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within <TenantProvider>");
  return ctx;
}
