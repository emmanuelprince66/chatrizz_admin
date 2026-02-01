// src/api/reports/resolve-report.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface SuspendUsersProp {
  id: string;
}

interface SuspendUserResponse {
  message?: string;
}

export const useSuspendUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SuspendUserResponse, Error, SuspendUsersProp>({
    mutationFn: async ({ id }: SuspendUsersProp) => {
      const response = await axiosInstance.get<SuspendUserResponse>(
        `/admin/suspend/${id}/`,
      );
      return response.data;
    },

    onSuccess: () => {
      // Invalidate and refetch all reports queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Failed to resolve report:", error);
    },
  });
};
