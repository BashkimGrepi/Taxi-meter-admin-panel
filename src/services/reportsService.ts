import { axiosInstance } from './AxiosInstance';
import { MonthlyReportSummary } from '../types/schema';
import { monthToRange } from '../utils/dates';

export async function getMonthlySummary(month: string): Promise<MonthlyReportSummary> {
  const { from, to } = monthToRange(month);

  // Preferred admin endpoint
  try {
    const { data } = await axiosInstance.get('/admin/reports/summary', { params: { from, to } });
    return normalizeMonthly(month, data, from, to);
  } catch {}

  // Fallback: payments summary if exposed
  try {
    const { data } = await axiosInstance.get('/admin/payments/summary', { params: { from, to } });
    return normalizeMonthly(month, data, from, to);
  } catch {}

  return normalizeMonthly(month, {}, from, to);
}

function normalizeMonthly(month: string, data: any, from: string, to: string): MonthlyReportSummary {
  return {
    month, from, to,
    ridesCount: data?.ridesCount ?? data?.rides ?? undefined,
    completedRatio: data?.completedRatio ?? data?.completion ?? null,
    subtotal: data?.subtotal ?? data?.fareSubtotal ?? data?.revenueSubtotal ?? null,
    tax: data?.tax ?? data?.taxAmount ?? null,
    total: data?.total ?? data?.revenueTotal ?? null,
    activeDrivers: data?.activeDrivers ?? data?.drivers ?? null,
  };
}
