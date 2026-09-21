import { queryClient } from "@/lib/query-client";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/store/authStore";
import type { TokenRefreshResponse } from "@/types/auth.types";
import axios, { isAxiosError } from "axios";
import { API_BASE_URL, API_TIMEOUT_MS } from "./config";
import { ENDPOINTS } from "./endpoints";

export const SESSION_EXPIRED_PARAM = "session";
export const SESSION_EXPIRED_VALUE = "expired";

// Keys written by earlier versions of the app; cleared on sign-out so nothing lingers.
const LEGACY_STORAGE_KEYS = ["user_data", "auth_token"];

class MissingRefreshTokenError extends Error {
  constructor() {
    super("No valid refresh token");
    this.name = "MissingRefreshTokenError";
  }
}

// Bare client with no interceptors, so a failing refresh can never recurse into itself.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string> | null = null;

const requestNewAccessToken = async (): Promise<string> => {
  const refresh = tokenStorage.getRefreshToken();
  if (!refresh) throw new MissingRefreshTokenError();

  const { data } = await refreshClient.post<TokenRefreshResponse>(
    ENDPOINTS.auth.refresh,
    { refresh },
  );
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
};

/**
 * Exchanges the refresh token for a new access token. Concurrent callers share
 * one in-flight request, so a burst of 401s triggers a single refresh.
 */
export const refreshAccessToken = (): Promise<string> => {
  refreshPromise ??= requestNewAccessToken().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

/** True when the server rejected the refresh token (as opposed to a network failure). */
export const isRefreshRejected = (error: unknown): boolean => {
  if (error instanceof MissingRefreshTokenError) return true;
  const status = isAxiosError(error) ? error.response?.status : undefined;
  return status === 400 || status === 401 || status === 403;
};

/** Returns a usable access token, refreshing it first if needed. */
export const getFreshAccessToken = async (): Promise<string | null> => {
  const access = tokenStorage.getAccessToken();
  if (access) return access;
  try {
    return await refreshAccessToken();
  } catch {
    return null;
  }
};

/**
 * Confirms the user can make authenticated calls. A network failure keeps the
 * session (the app will surface request errors) instead of logging the user out.
 */
export const ensureValidSession = async (): Promise<boolean> => {
  if (tokenStorage.getAccessToken()) return true;
  try {
    await refreshAccessToken();
    return true;
  } catch (error) {
    if (isRefreshRejected(error)) {
      clearSession();
      return false;
    }
    return true;
  }
};

/** Removes every trace of the signed-in user: tokens, profile and cached API data. */
export const clearSession = () => {
  tokenStorage.clear();
  useAuthStore.getState().clearUser();
  queryClient.clear();
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

let isRedirecting = false;

/** Ends an expired session and sends the user to the login screen (once, however many requests fail). */
export const expireSession = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  clearSession();
  window.location.replace(
    `/login?${SESSION_EXPIRED_PARAM}=${SESSION_EXPIRED_VALUE}`,
  );
};
