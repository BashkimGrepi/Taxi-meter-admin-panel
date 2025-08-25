import { axiosInstance } from './AxiosInstance';
import { Invitation, Role } from '../types/schema';

export async function inviteDriver(payload: {
  email: string;
  role?: Role;                 // default DRIVER
  driverProfileId?: string;
}) {
  const body = { role: payload.role ?? Role.DRIVER, ...payload };
  const { data } = await axiosInstance.post<Invitation>('/admin/invitations', body);
  return data;
}

// (Optional helpers if you want to expose them in UI later)
export async function resendInvitation(id: string) {
  const { data } = await axiosInstance.patch<Invitation>(`/admin/invitations/${id}/resend`, {});
  return data;
}
export async function cancelInvitation(id: string) {
  await axiosInstance.delete(`/admin/invitations/${id}`);
}
