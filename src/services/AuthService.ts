import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data.token;
};

export const saveToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const decodeToken = (token: string): any => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
        return {};
    }
} 

