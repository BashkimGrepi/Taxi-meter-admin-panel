import { BussinessStatusResponse, DriverActivity, LiveOperations, PaymentSummaryResponse, PerformanceTrendsResponse, RevenueOverviewResponse } from "../../types/dashboard";
import { axiosInstance } from "../AxiosInstance";

export type query = { 
    period: "all_time" | "current_month" | "today";
}

export async function getBussinessStatus(query: query): Promise<BussinessStatusResponse> {
    const { data } = await axiosInstance.get("/admin/dashboard/business-status", { params: query });
    return data;
}


export async function getRevenueOverview(query: query): Promise<RevenueOverviewResponse> {
    const { data } = await axiosInstance.get("/admin/dashboard/revenue-overview", { params: query });
    return data;
}

export async function getPaymentSummary(query: query): Promise<PaymentSummaryResponse> {
    const { data } = await axiosInstance.get("/admin/dashboard/payment-summary", { params: query });
    return data;
}


export async function getLiveOperations(): Promise<LiveOperations | string>  {
    const { data } = await axiosInstance.get("/admin/dashboard/live-operations");
    return data;
}

export async function getDriversActivity(): Promise<DriverActivity> {
    const { data } = await axiosInstance.get("/admin/dashboard/driver-activity");
    return data;
}

export async function getPerformanceTrends(): Promise<PerformanceTrendsResponse> {
    const { data } = await axiosInstance.get("/admin/dashboard/performance-trends");
    return data;
}