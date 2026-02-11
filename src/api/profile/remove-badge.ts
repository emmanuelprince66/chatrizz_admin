// src/api/profile/remove-badge.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface RemoveBadgePayload {
  id: string;
}

interface RemoveBadgeResponse {
  message?: string;
  success?: boolean;
}

export const useRemoveBadgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveBadgeResponse, Error, RemoveBadgePayload>({
    mutationFn: async ({ id }: RemoveBadgePayload) => {
      const response = await axiosInstance.get<RemoveBadgeResponse>(
        `/admin/remove_badge/${id}/`,
      );
      return response.data;
    },

    onSuccess: (_, variables) => {
      // Invalidate user detail query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["user-detail", variables.id],
      });

      // Invalidate users list to reflect badge removal
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    retry: 1,
  });
};

export type { RemoveBadgePayload, RemoveBadgeResponse };
