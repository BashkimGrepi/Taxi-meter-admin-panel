import { axiosInstance } from './AxiosInstance';
import { Page, Ride, RideStatus } from '../types/schema';
import { fromApiRideStatus, toApiRideStatus } from './statusMap';

function normalizeList(data: any): Page<Ride> {
  const wrap = (items: any[]) => ({
    items: items.map((r: any) => ({ ...r, status: fromApiRideStatus(r.status) })),
    total: data?.total ?? items.length,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? items.length,
  });

  if (Array.isArray(data)) return wrap(data);
  if (data?.items && Array.isArray(data.items)) return wrap(data.items);
  return { items: [], total: 0, page: 1, pageSize: 25 };
}

export async function listRides(params: {
  from?: string; to?: string;
  status?: RideStatus | 'ALL';
  driverId?: string;
  page?: number; pageSize?: number;
  sort?: string;
}) {
  const { data } = await axiosInstance.get('/admin/rides', {
    params: {
      from: params.from, to: params.to,
      status: toApiRideStatus(params.status),
      driverId: params.driverId,
      page: params.page, pageSize: params.pageSize,
      sort: params.sort,
    },
  });
  return normalizeList(data);
}

export async function getRide(id: string) {
  const { data } = await axiosInstance.get<Ride>(`/admin/rides/${id}`);
  return { ...data, status: fromApiRideStatus((data as any).status) } as Ride;
}
