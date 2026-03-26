import { AdminRidesResponse, RideDetailResponseDto, RidesQueryParams } from "../../types/rides";
import { axiosInstance } from "../AxiosInstance";





export async function getRidesList(query?: RidesQueryParams): Promise<AdminRidesResponse> {
    const { data } = await axiosInstance.get("/admin/rides-v2", { params: query})
    return data;
}

export async function getRideDetails(rideId: string): Promise<RideDetailResponseDto> {
    const { data } = await axiosInstance.get(`/admin/rides-v2/${rideId}`);

    return data;
}