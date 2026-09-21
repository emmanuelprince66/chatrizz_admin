import { tokenStorage } from "@/lib/token-storage";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { clearSession } from "../session";

const LOGOUT_TIMEOUT_MS = 5_000;

/**
 * Revokes the refresh token on the server, then clears the local session.
 * Local state is cleared even if the server call fails, so logout always succeeds.
 */
export const logout = async () => {
  const refreshToken = tokenStorage.getRefreshToken();
  try {
    if (refreshToken) {
      await axiosInstance.post(
        ENDPOINTS.auth.logout,
        { refresh_token: refreshToken },
        { timeout: LOGOUT_TIMEOUT_MS },
      );
    }
  } catch {
    // The token is discarded locally regardless; it will also expire on its own.
  } finally {
    clearSession();
  }
};
