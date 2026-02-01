import { Spinner } from "@/components/ui/spinner";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Helper to check if access token is expired
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
};

/**
 * Refresh the access token using the refresh token
 */
const refreshAccessToken = async (refreshToken: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();

      // Store new access token
      Cookies.set("access_token", data.access);

      // Update refresh token if provided
      if (data.refresh) {
        Cookies.set("refresh_token", data.refresh);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

/**
 * Clear all auth cookies
 */
const clearAuthCookies = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  localStorage.removeItem("user_data");
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        const refreshToken = Cookies.get("refresh_token");

        // No tokens at all
        if (!accessToken && !refreshToken) {
          setAuthFailed(true);
          setIsCheckingAuth(false);
          return;
        }

        // Valid access token exists
        if (accessToken && !isTokenExpired(accessToken)) {
          setIsCheckingAuth(false);
          return;
        }

        // Access token expired, try to refresh
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken);

          if (!refreshed) {
            // Refresh failed
            clearAuthCookies();
            setAuthFailed(true);
          }
        } else {
          setAuthFailed(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        clearAuthCookies();
        setAuthFailed(true);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  // Show loader while checking
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner color="text-purple-300" size="xxl" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (authFailed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
