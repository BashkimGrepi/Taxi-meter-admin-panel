import { OrderBy, OrderDir, PricingPolicy, PricingPolicyListResponse } from "../types/schema";
import { axiosInstance } from "./AxiosInstance";


export async function listPricingPolicies(params: {
    isActive?: boolean;
    search?: string;
    offset?: number;
    limit?: number;
    orderBy?: OrderBy;
    orderDir?: OrderDir;
}) {
    const { data } = await axiosInstance.get<PricingPolicyListResponse>('/pricing-policies', { params });
    return data;
}

export async function createPricingPolicy(dto: {
    name: string;
    baseFare: string; // Decimal serialized as string
    perKm: string;    // up to 4 decimals
    isActive?: boolean;
}) {
    const { data } = await axiosInstance.post<PricingPolicy>('/pricing-policies', dto);
    return data;
}

export async function updatePricingPolicy(id: string, dto: Partial<{
  name: string;
  baseFare: string;
  perKm: string;
}>) {
  const { data } = await axiosInstance.patch<PricingPolicy>(`/pricing-policies/update/${id}`, dto);
  return data;
}

export async function activatePricingPolicy(id: string) {
    const { data } = await axiosInstance.post<{ id: string; isActive: boolean }>(`/pricing-policies/${id}/activate`);
    return data;
}

export async function getActivePricingPolicy() {
  const { data } = await axiosInstance.get<PricingPolicy | null>('/pricing-policies/active/current');
  return data;
}

