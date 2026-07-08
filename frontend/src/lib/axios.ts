import axios from "axios";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: any;
}[] = [];

const processQueue = (
  error: any,
  retry = false
) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else if (retry) {
      request.resolve(api(request.config));
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : "";

    if (
      currentPath === "/" ||
      currentPath === "/login"
    ) {
      return Promise.reject(error);
    }

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/google") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Shared refresh helper
        await refreshAccessToken();

        processQueue(null, true);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, false);

        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);