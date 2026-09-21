import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/** Treat tokens as expired slightly early so in-flight requests don't race the expiry. */
const EXPIRY_SKEW_MS = 30_000;

const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(base64)) as { exp?: unknown };
    return typeof exp === "number" ? new Date(exp * 1000) : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  return !expiry || expiry.getTime() - EXPIRY_SKEW_MS <= Date.now();
};

const setTokenCookie = (key: string, token: string) => {
  Cookies.set(key, token, {
    path: "/",
    sameSite: "strict",
    secure: window.location.protocol === "https:",
    // The cookie dies with the token, so an expired token is never left behind.
    expires: getTokenExpiry(token) ?? undefined,
  });
};

const getValidToken = (key: string): string | null => {
  const token = Cookies.get(key);
  if (!token) return null;
  if (isTokenExpired(token)) {
    Cookies.remove(key, { path: "/" });
    return null;
  }
  return token;
};

export const tokenStorage = {
  /** Returns the access token only while it is still valid. */
  getAccessToken: () => getValidToken(ACCESS_TOKEN_KEY),

  /** Returns the refresh token only while it is still valid. */
  getRefreshToken: () => getValidToken(REFRESH_TOKEN_KEY),

  setTokens: ({ access, refresh }: { access: string; refresh?: string }) => {
    setTokenCookie(ACCESS_TOKEN_KEY, access);
    if (refresh) setTokenCookie(REFRESH_TOKEN_KEY, refresh);
  },

  clear: () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
  },

  /** True when there is a usable token, or one that can be renewed. */
  hasSession: () =>
    Boolean(getValidToken(ACCESS_TOKEN_KEY) || getValidToken(REFRESH_TOKEN_KEY)),
};
