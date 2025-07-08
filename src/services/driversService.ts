import axiosInstance from "../services/AxiosInstance";
import { Driver } from "../types/Driver";

//const API_URL = "http://localhost:8080/api/drivers";


//axiosInstanse is already set up with the base URL and token interceptor ->
//localhost:8080/api

//get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
    const response = await axiosInstance.get("/drivers")
    return response.data;
};

//update driver
export const updateDriver = async (driver: Driver): Promise<Driver> => {
    const response = await axiosInstance.put(`/drivers/edit/${driver.driverId}`, driver);
    return response.data;
}

//delete driver
export const deleteDriver = async (driverId: number): Promise<void> => {
  await axiosInstance.delete(`/drivers/delete/${driverId}`);
};