import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 💡 NEW: Global state variables to lock parallel execution lines
let isRefreshing = false;
let failedQueue: any[] = [];

// Helper to drain or reject the waiting queue once the token call resolves
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(api(prom.config));
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) return Promise.reject(error);

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    if (currentPath === "/" || currentPath === "/login") {
      return Promise.reject(error);
    }

    const isAuthRoute = originalRequest.url?.includes("/auth/login") || 
                        originalRequest.url?.includes("/auth/refresh-token");

    // If an access token expires, hit the refresh endpoint
    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      
      // 💡 NEW: If another request is currently refreshing the tokens, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true; // Set lock to true immediately

      try {
        // Backend cycles the HTTP-only cookies transparently
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        processQueue(null, "refreshed"); // 🚀 Release all queued up background requests safely

        return api(originalRequest); 
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null); // Reject everyone waiting in line if the refresh token is truly dead
        
        console.error("Refresh token invalid. Routing to login.");
        if (typeof window !== "undefined") {
          window.location.replace("/login"); 
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);