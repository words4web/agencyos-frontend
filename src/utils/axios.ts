import axios, { AxiosInstance } from "axios";
import { store } from "../store";
import { clearAuth, setAccessToken } from "../store/authSlice";
import { API_ROUTES } from "@/constants/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Secure cookies automatically
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers["x-platform"] = "web";
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isAuthEndpoint =
        originalRequest?.url?.includes(API_ROUTES.AUTH.LOGIN) ||
        originalRequest?.url?.includes(API_ROUTES.AUTH.REFRESH_TOKEN) ||
        originalRequest?.url?.includes(API_ROUTES.AUTH.LOGOUT);

      if (isAuthEndpoint) {
        isRefreshing = false;
        const isLogoutRequest = originalRequest?.url?.includes(
          API_ROUTES.AUTH.LOGOUT,
        );
        if (!isLogoutRequest) {
          store.dispatch(clearAuth());
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
          {},
          { timeout: 30000, withCredentials: true },
        );
        const newAccessToken = response.data?.data?.accessToken;
        if (newAccessToken) {
          store.dispatch(setAccessToken(newAccessToken));
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } else {
          throw new Error("New access token not found in response");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearAuth());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
