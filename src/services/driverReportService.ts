import axiosInstance from "../services/AxiosInstance";
import { Report } from "../types/Report";

//const API_URL = "http://localhost:8080/api/drivers";


//axiosInstanse is already set up with the base URL and token interceptor ->
//localhost:8080/api

export const getDriverReport = async (driverId: number, date: string): Promise<Report> => {
    const response = await axiosInstance.get(`/reports/summary/${driverId}?date=${date}`);
    return response.data;

};