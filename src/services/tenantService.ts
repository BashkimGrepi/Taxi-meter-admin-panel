import { axiosInstance } from './AxiosInstance';
import { Tenant } from '../types/schema';
import { getStoredToken } from './AxiosInstance';
import { getJwtPayload } from '../utils/jwt';

export async function getTenant(tenantId: string): Promise<Tenant> {
  try {
    
    const { data } = await axiosInstance.get<Tenant>(`/tenants/${tenantId}`);
    return data;
  } catch (err: any) {
    // Graceful fallback: use values from the JWT so the UI can still render a name
    const token = getStoredToken();
    const p = token ? getJwtPayload(token) : null;
    if (p?.tenantId === tenantId) {
      return { id: tenantId, name: p.tenantName ?? '—', businessId: '' } as Tenant;
    }
    throw err;
  }
}

export async function selectTenant(): Promise<Tenant[]> {
  try {
    const { data } = await axiosInstance.post<Tenant[]>("/tenants/select-tenant")
    return data;
  } catch (err) {
    throw err;
  }
}
