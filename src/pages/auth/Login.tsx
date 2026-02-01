import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <div className="">
      <LoginForm />
    </div>
  );
};
