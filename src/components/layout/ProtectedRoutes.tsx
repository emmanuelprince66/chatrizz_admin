import { ensureValidSession } from "@/api/session";
import { Spinner } from "@/components/ui/spinner";
import { tokenStorage } from "@/lib/token-storage";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStorage.getAccessToken() ? "authenticated" : "checking",
  );

  useEffect(() => {
    if (status !== "checking") return;

    let cancelled = false;
    ensureValidSession().then((isValid) => {
      if (!cancelled) setStatus(isValid ? "authenticated" : "unauthenticated");
    });

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner color="text-purple-300" size="xxl" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
};
