// src/api/notifications/update-notification.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface UpdateNotificationPayload {
  title: string;
  message: string;
  type: "ALL" | "ADMINS" | "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";
  channel: "IN-APP" | "PUSH" | "EMAIL";
}

interface UpdateNotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  created_at: string;
}

export const useUpdateNotificationMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateNotificationResponse,
    Error,
    UpdateNotificationPayload
  >({
    mutationFn: async (payload: UpdateNotificationPayload) => {
      const response = await axiosInstance.patch<UpdateNotificationResponse>(
        `/admin/single_broadcast/${id}`,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification", id] });
    },
    onError: (error) => {
      console.error("Failed to update notification:", error);
    },
  });
};

// Export types separately
export type { UpdateNotificationPayload, UpdateNotificationResponse };
