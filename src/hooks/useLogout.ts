import { logout } from "@/api/auth/logout";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogout = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      navigate("/login", { replace: true });
      toast.success("Logged out successfully");
    },
  });

  return { logout: () => mutate(), isLoggingOut: isPending };
};
