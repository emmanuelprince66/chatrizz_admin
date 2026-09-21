import { SESSION_EXPIRED_PARAM, SESSION_EXPIRED_VALUE } from "@/api/session";
import LoginForm from "@/components/auth/LoginForm";
import { tokenStorage } from "@/lib/token-storage";
import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isSessionExpired =
    searchParams.get(SESSION_EXPIRED_PARAM) === SESSION_EXPIRED_VALUE;

  useEffect(() => {
    if (!isSessionExpired) return;
    toast.error("Session expired. Please login again.");
    setSearchParams({}, { replace: true });
  }, [isSessionExpired, setSearchParams]);

  if (tokenStorage.hasSession()) {
    return <Navigate to="/overview" replace />;
  }

  return <LoginForm />;
};
