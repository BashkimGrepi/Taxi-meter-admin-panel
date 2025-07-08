import axios from "axios";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to attach the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;