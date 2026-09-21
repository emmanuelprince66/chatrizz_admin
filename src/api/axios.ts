import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { API_BASE_URL, API_TIMEOUT_MS } from "./config";
import {
  expireSession,
  getFreshAccessToken,
  isRefreshRejected,
  refreshAccessToken,
} from "./session";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Send without an access token and never attempt a refresh (e.g. login). */
    skipAuth?: boolean;
    /** Internal: set once a request has been retried after a token refresh. */
    _retried?: boolean;
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: API_TIMEOUT_MS,
});

const setAuthHeader = (config: InternalAxiosRequestConfig, token: string) => {
  config.headers.Authorization = `Bearer ${token}`;
};

axiosInstance.interceptors.request.use(async (config) => {
  if (config.skipAuth) return config;

  // Refreshes proactively when the access token has expired, saving a 401 round trip.
  const token = await getFreshAccessToken();
  if (token) setAuthHeader(config, token);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config;
    const status = error.response?.status;

    if (status === 401 && request && !request.skipAuth && !request._retried) {
      request._retried = true;
      try {
        setAuthHeader(request, await refreshAccessToken());
        return axiosInstance(request);
      } catch (refreshError) {
        if (isRefreshRejected(refreshError)) expireSession();
        return Promise.reject(error);
      }
    }

    if (status === 401 && request?._retried) {
      // Still unauthorised with a freshly issued token: the session is unusable.
      expireSession();
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  },
);
