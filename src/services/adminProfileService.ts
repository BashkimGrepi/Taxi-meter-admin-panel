import { AdminProfileResponse } from "../types/schema";
import { axiosInstance } from "./AxiosInstance";


export async function getAdminProfile(): Promise<AdminProfileResponse> {
    const res = await axiosInstance.get<AdminProfileResponse>('/admin/profile');
    if (res.status !== 200) throw new Error('Failed to fetch admin profile');
    console.log('Admin profile response:', res.data);
    return res.data;
}