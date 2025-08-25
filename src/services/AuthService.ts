import { axiosInstance } from './AxiosInstance';
import { Role } from '../types/schema';

export type TenantOption = {
  tenantId: string;
  tenantName: string;
  role?: Role; // ADMIN/MANAGER for admin login selection
};

export type LoginSelectionResponse = {
  requiresTenantSelection: true;
  tenants: TenantOption[];
};

export type LoginSuccessResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: string; // e.g. "1h"
};

export type LoginResponse = LoginSelectionResponse | LoginSuccessResponse;

export function isSelection(res: LoginResponse): res is LoginSelectionResponse {
  return (res as any)?.requiresTenantSelection === true;
}

export function hasToken(res: LoginResponse): res is LoginSuccessResponse {
  return typeof (res as any)?.access_token === 'string';
}

/** Admin/Manager login. If tenantId omitted and user has many memberships, API returns selection. */
export async function loginAdmin(params: { email: string; password: string; tenantId?: string }): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', params);
  return data;
}

/** Convenience: extract token string from a success response */
export function extractToken(r: LoginSuccessResponse) {
  return r.access_token;
}

//export async function getMe() {
  //const { data } = await axiosInstance.get<User>('/auth/me');
  //return data;
//}
