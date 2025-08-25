import { axiosInstance } from './AxiosInstance';
import { DriverProfile, DriverStatus, Page } from '../types/schema';

function normalizeList(data: any): Page<DriverProfile> {
  if (Array.isArray(data)) return { items: data, total: data.length, page: 1, pageSize: data.length };
  if (data?.items && Array.isArray(data.items)) return data as Page<DriverProfile>;
  return { items: [], total: 0, page: 1, pageSize: 25 };
}

export async function listDrivers(params: {
  q?: string;
  page?: number;
  pageSize?: number;
  status?: DriverStatus | 'ALL';
  sort?: string;
}) {
  // Send both q and search to be compatible
  const { data } = await axiosInstance.get('/admin/drivers', {
    params: {
      q: params.q, search: params.q,
      status: params.status,
      page: params.page, pageSize: params.pageSize,
      sort: params.sort,
    },
  });
  return normalizeList(data);
}

export async function createDriverProfile(payload: {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  taxiNumber?: string;
}) {
  const { data } = await axiosInstance.post<DriverProfile>('/admin/drivers', payload);
  return data;
}

export async function updateDriverProfile(id: string, patch: Partial<DriverProfile>) {
  const { data } = await axiosInstance.patch<DriverProfile>(`/admin/drivers/${id}`, patch);
  return data;
}
