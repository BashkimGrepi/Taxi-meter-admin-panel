import axios from 'axios';

// Simple token/tenant accessors (AuthProvider will keep these in localStorage initially)
const TOKEN_KEY = 'auth.token';
const TENANT_KEY = 'tenant.id';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (t: string | null) =>
  t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY);

export const getStoredTenantId = () => localStorage.getItem(TENANT_KEY);
export const setStoredTenantId = (id: string | null) =>
  id ? localStorage.setItem(TENANT_KEY, id) : localStorage.removeItem(TENANT_KEY);

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

axiosInstance.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    // Normalize Axios errors
    if (err.response) {
      err.message =
        err.response?.data?.message ??
        err.response?.data?.error ??
        `Request failed with status ${err.response.status}`;
    } else if (err.request) {
      err.message = 'Network error — no response from server';
    } else {
      err.message = err.message ?? 'Unknown error';
    }
    return Promise.reject(err);
  },
);
