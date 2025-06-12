import { getToken, removeToken } from "@/utils/token";
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Add Token Only for Protected Routes)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { noAuth?: boolean }) => {
    const token = getToken();

    // Add token only if the request does not contain `noAuth` in config
    if (token && !config.noAuth) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Handle Expired Tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token expired, redirect to login...");
      removeToken();
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
