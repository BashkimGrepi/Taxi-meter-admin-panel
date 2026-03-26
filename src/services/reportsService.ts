import { axiosInstance } from './AxiosInstance';
import { ReportsSummaryResponse, MonthlyPaymentMethodsReport, ReportsSummaryDto } from '../types/schema';
import { monthToRange } from '../utils/dates';

export async function getReportsSummary(query?:ReportsSummaryDto ): Promise<ReportsSummaryResponse> {
  //const { from, to } = monthToRange(query?.from || '', query?.to || '');
  // Preferred admin endpoint
  const { data } = await axiosInstance.get('/admin/reports/summary', { params: query });
  console.log("Monthly Summary Data: ", JSON.stringify(data));
  return data; 
}



export async function getMonthlyPaymentMethods(month: string): Promise<MonthlyPaymentMethodsReport> {
  const { from, to } = monthToRange(month);
  const { data } = await axiosInstance.get('/admin/reports/payment-methods', { params: { from, to } });
  return data;
}
