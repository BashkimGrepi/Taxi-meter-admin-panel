import { axiosInstance } from './AxiosInstance';
import { Page, Payment, PaymentProvider, PaymentStatus } from '../types/schema';
import { fromApiPaymentStatus, toApiPaymentStatus } from './statusMap';

function normalizeList(data: any): Page<Payment> {
  const wrap = (items: any[]) => ({
    items: items.map((p: any) => ({ ...p, status: fromApiPaymentStatus(p.status) })),
    total: data?.total ?? items.length,
    page: data?.page ?? 1,
    pageSize: data?.pageSize ?? items.length,
  });

  if (Array.isArray(data)) return wrap(data);
  if (data?.items && Array.isArray(data.items)) return wrap(data.items);
  return { items: [], total: 0, page: 1, pageSize: 25 };
}

export async function listPayments(params: {
  from?: string; to?: string;
  status?: PaymentStatus | 'ALL';
  driverId?: string;
  provider?: PaymentProvider | 'ALL';
  page?: number; pageSize?: number;
  sort?: string;
  minAmount?: number; maxAmount?: number;
}) {
  const { data } = await axiosInstance.get('/admin/payments', {
    params: {
      from: params.from, to: params.to,
      status: toApiPaymentStatus(params.status),
      driverId: params.driverId,
      provider: params.provider && params.provider !== 'ALL' ? params.provider : undefined,
      page: params.page, pageSize: params.pageSize,
      sort: params.sort,
      minAmount: params.minAmount, maxAmount: params.maxAmount,
    },
  });
  return normalizeList(data);
}

export async function getPayment(id: string) {
  const { data } = await axiosInstance.get<Payment>(`/admin/payments/${id}`);
  return { ...data, status: fromApiPaymentStatus((data as any).status) } as Payment;
}
