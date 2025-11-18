import { axiosInstance } from './AxiosInstance';
import { Page, Payment, PaymentProvider, PaymentStatus } from '../types/schema';
import { fromApiPaymentStatus, toApiPaymentStatus } from './statusMap';

function normalizePayment(p: any): Payment {
  return {
    id: p.id,
    tenantId: p.tenantId,
    rideId: p.rideId ?? p.ride?.id ?? null,

    // provider can be provider | paymentMethod | method | gateway
    provider: (p.provider ?? p.paymentMethod ?? p.method ?? p.gateway ?? '') as any,

    // status can be status | state
    status: fromApiPaymentStatus((p.status ?? p.state) ?? ''),

    amount: Number(p.amount ?? p.total ?? 0),
    currency: p.currency ?? 'EUR',

    createdAt: p.createdAt ?? null,
    authorizedAt: p.authorizedAt ?? null,
    capturedAt: p.capturedAt ?? p.paidAt ?? p.settledAt ?? p.createdAt ?? null,
    updatedAt: p.updatedAt ?? null,

    externalPaymentId: p.externalPaymentId ?? p.txnId ?? p.transactionId ?? null,

    // numbering used by your export
    receiptNumber: p.receiptNumber ?? null,
    invoiceNumber: p.invoiceNumber ?? null,
    numberPeriod: p.numberPeriod ?? null,
  };
}

function normalizeList(data: any): Page<Payment> {
  const wrap = (items: any[]) => {
    const mapped = items.map(normalizePayment);
    return {
      items: mapped,
      total: data?.total ?? mapped.length,
      page: data?.page ?? 1,
      pageSize: data?.pageSize ?? mapped.length,
    };
  };
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
  return normalizePayment(data as any);
}
