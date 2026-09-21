import { axiosInstance } from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { getApiErrorMessage } from "@/api/utils";
import { tokenStorage } from "@/lib/token-storage";
import { useAuthStore } from "@/store/authStore";
import type { LoginResponse } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const DEFAULT_REDIRECT = "/overview";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(68, "Password must be at most 68 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Only same-app paths are allowed, so a crafted link can't redirect off-site after login. */
const getSafeRedirect = (from: unknown): string =>
  typeof from === "string" && from.startsWith("/") && !from.startsWith("//")
    ? from
    : DEFAULT_REDIRECT;

export const useLoginHook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const { data } = await axiosInstance.post<LoginResponse>(
        ENDPOINTS.auth.login,
        credentials,
        { skipAuth: true },
      );
      return data;
    },
    onSuccess: ({ tokens, ...user }) => {
      tokenStorage.setTokens(tokens);
      setUser(user);
      toast.success("Login successful!");
      navigate(getSafeRedirect(location.state?.from), { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Invalid email or password."));
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  };
};
