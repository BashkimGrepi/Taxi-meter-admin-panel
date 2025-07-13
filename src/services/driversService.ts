import axiosInstance from "../services/AxiosInstance";
import { Driver } from "../types/Driver";




//axiosInstanse is already set up with the base URL and token interceptor ->
//http://localhost:8080/api

//get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
    const response = await axiosInstance.get("/admin/drivers")
    return response.data;
};

//add driver method is in the add driver page
//import the logic here later

//update driver
export const updateDriver = async (driver: Driver): Promise<Driver> => {
    const response = await axiosInstance.put(`/admin/drivers/edit/${driver.driverId}`, driver);
    return response.data;
}

//delete driver
export const deleteDriver = async (driverId: number): Promise<void> => {
  await axiosInstance.delete(`/admin/drivers/delete/${driverId}`);
};