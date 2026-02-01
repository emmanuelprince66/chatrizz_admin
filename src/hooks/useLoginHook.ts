import { axiosInstance } from "@/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

// Validation schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Updated Types based on actual API response
interface LoginResponse {
  id: string;
  email: string;
  tokens: {
    refresh: string;
    access: string;
  };
  is_verified: boolean;
  profile: boolean;
}

// interface UserData {
//   id: string;
//   email: string;
//   is_verified: boolean;
//   profile: boolean;
// }

export const useLoginHook = () => {
  const navigate = useNavigate();

  // Form handling
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // API mutation
  const mutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login/",
        credentials,
      );
      return response.data;
    },

    onSuccess: (data) => {
      console.log("data", data);

      // Extract tokens and user data
      const { tokens, ...userData } = data;

      Cookies.set("access_token", tokens.access);

      Cookies.set("refresh_token", tokens.refresh);

      // Store user data in localStorage
      localStorage.setItem("user_data", JSON.stringify(userData));

      // Update auth store

      toast.success("Login successful!");
      navigate("/overview");
    },

    onError: (error: any) => {
      console.log("error", error);
      toast.error(error.response?.data?.message || "Login failed");
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
