import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { BaseUrl } from "./config";

export const axiosInstance = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor - attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const token = Cookies.get("access_token");
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get("refresh_token");

      if (!refreshToken) {
        // No refresh token available, logout user
        clearAuthData();
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${BaseUrl}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;

        // Store new access token
        Cookies.set("access_token", access, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Process queued requests
        processQueue();
        isRefreshing = false;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError);
        isRefreshing = false;
        clearAuthData();
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  },
);

// Helper function to clear all auth data
const clearAuthData = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  localStorage.removeItem("user_data");
  localStorage.removeItem("auth-storage");
};

// Export helper function for logout
export const logout = () => {
  clearAuthData();
  window.location.href = "/login";
  toast.success("Logged out successfully");
};
