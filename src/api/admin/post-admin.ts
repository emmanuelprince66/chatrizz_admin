// src/api/admin/post-admin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface CreateAdminPayload {
  full_name: string;
  email: string;
  role: "Administrator" | "Sub-admin";
}

interface CreateAdminResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  admin_role: string;
  is_active: boolean;
  created_at: string;
}

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminResponse, Error, CreateAdminPayload>({
    mutationFn: async (payload: CreateAdminPayload) => {
      const response = await axiosInstance.post<CreateAdminResponse>(
        "/admin/team/",
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch all admins queries
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Failed to create admin:", error);
    },
  });
};

// Export types
export type { CreateAdminPayload, CreateAdminResponse };
