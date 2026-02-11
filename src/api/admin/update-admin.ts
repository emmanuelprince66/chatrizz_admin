// src/api/admin/update-admin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface UpdateAdminPayload {
  full_name: string;
  email: string;
  role: "Administrator" | "Sub-admin";
}

interface UpdateAdminResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  admin_role: string;
  is_active: boolean;
  created_at: string;
}

export const useUpdateAdminMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAdminResponse, Error, UpdateAdminPayload>({
    mutationFn: async (payload: UpdateAdminPayload) => {
      const response = await axiosInstance.patch<UpdateAdminResponse>(
        `/admin/team/${id}/`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin", id] });
    },
    onError: (error) => {
      console.error("Failed to update admin:", error);
    },
  });
};

// Export types separately
export type { UpdateAdminPayload, UpdateAdminResponse };
