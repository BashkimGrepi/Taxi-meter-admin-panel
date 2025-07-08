import axiosInstance from "../services/AxiosInstance";
import { Entrepenouer } from "../types/Entrepenouer";
import { VivaSettingsDTO } from "../types/VivaSettingsDTO";

//axiosInstanse is already set up with the base URL and token interceptor ->
//localhost:8080/api

export const getEntrepenouerProfile = async (): Promise<Entrepenouer> => {
    const response = await axiosInstance.get("/admin/profile");
    return response.data;
}

export const updateEntrepenouerProfile = async (profileData: Partial<Entrepenouer>) => {
  const response = await axiosInstance.put("/admin/profile/edit", profileData);
  return response.data;
};

export const getEntrepenouerVivaData = async (): Promise<VivaSettingsDTO> => {
  const response = await axiosInstance.get("/admin/viva-data")
  return response.data;
}

export const updateEntrepenouerViva = async (vivaData: VivaSettingsDTO) => {
  const response = await axiosInstance.put("/admin/viva-settings", vivaData);
  return response.data;
}


export const getVivaOAuthUrl = async (): Promise<string> => {
  const response = await axiosInstance.get("/admin/viva-oauth-url");
  return response.data.authUrl;
};

export const processVivaOAuthCallback = async (code: string): Promise<void> => {
  await axiosInstance.post("/admin/viva-oauth-callback", { code });
};


export const getStripeProfile = async () => {
  const response = await axiosInstance.get("/stripe/profile");
  return response.data;
}
