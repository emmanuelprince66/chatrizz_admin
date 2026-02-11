// src/api/admin/suspend-admin.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

export const useSuspendAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axiosInstance.get(`/admin/suspend/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      console.error("Failed to suspend admin:", error);
    },
  });
};
