import {
  GetPaymentsQueryDto,
  GetPaymentsResponseDto,
  GetPaymentsTransactionsResponse,
  GetProfitTimelineQueryDto,
  ProfitChartResponse,
  QueryParamsPeriod,
} from "../../types/payments&Transactions";
import { axiosInstance } from "../AxiosInstance";

export async function getPaymentsAndTransactions(
  period: QueryParamsPeriod,
): Promise<GetPaymentsTransactionsResponse> {
  const { data } = await axiosInstance.get("/admin/payments-transactions", {
    params: period,
  });
  return data;
}

export async function getProfitTimeline(
  query: GetProfitTimelineQueryDto,
): Promise<ProfitChartResponse> {
  const { data } = await axiosInstance.get(
    "/admin/payments-transactions/profit-timeline",
    {
      params: query,
    },
  );
  return data;
}

export async function getPaymentsList(
  query: GetPaymentsQueryDto,
): Promise<GetPaymentsResponseDto> {
  const { data } = await axiosInstance.get(
    "/admin/payments-transactions/payments",
    {
      params: query,
    },
  );

  return data;
}
