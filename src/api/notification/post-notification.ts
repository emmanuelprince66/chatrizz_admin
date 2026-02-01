// src/api/notifications/post-notification.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface CreateNotificationPayload {
  title: string;
  message: string;
  type: "ALL" | "ADMINS" | "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";
  channel: "IN-APP" | "PUSH" | "EMAIL";
}

interface CreateNotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  created_at: string;
}

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateNotificationResponse,
    Error,
    CreateNotificationPayload
  >({
    mutationFn: async (payload: CreateNotificationPayload) => {
      const response = await axiosInstance.post<CreateNotificationResponse>(
        "/admin/broadcast/",
        payload,
      );
      return response.data;
    },

    onSuccess: () => {
      // Invalidate and refetch all notifications queries
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },

    onError: (error) => {
      console.error("Failed to create notification:", error);
    },
  });
};

// Export types
export type { CreateNotificationPayload, CreateNotificationResponse };
