import { axiosInstance } from './AxiosInstance';
import { MonthlyReportSummary, MontlyPaymentMethodsReport } from '../types/schema';
import { monthToRange } from '../utils/dates';

export async function getMonthlySummary(month: string): Promise<MonthlyReportSummary> {
  const { from, to } = monthToRange(month);
  // Preferred admin endpoint
  const { data } = await axiosInstance.get('/admin/reports/summary', { params: { from, to } });
  console.log("Monthly Summary Data: ", JSON.stringify(data));
    return normalizeMonthly(month, data);
 
}

function normalizeMonthly(month: string, data: any,): MonthlyReportSummary {
  return {
    period: month,
    totalRides: data?.totalRides ?? 0,
    totalRevenue: data?.totalRevenue  ?? 0,
    totalDistance: data?.totalDistance ?? 0,
    avgFarePerRide: data?.avgFarePerRide ?? 0,
    activeDrivers: data?.activeDrivers ?? data?.drivers ?? 0,
    completionRate: data?.completionRate ?? 0,
    paymentRate: data?.paymentRate ?? 0,
    topDriver: {
      name: data?.topDriver?.name ?? '',
      rides: data?.topDriver?.rides ?? 0,
      revenue: data?.topDriver?.revenue ?? 0,
    }
    

  };
}


export async function getMonthlyPaymentMethods(month: string): Promise<MontlyPaymentMethodsReport> {
  const { from, to } = monthToRange(month);
  const { data } = await axiosInstance.get('/admin/reports/payment-methods', { params: { from, to } });
  return data;
}
