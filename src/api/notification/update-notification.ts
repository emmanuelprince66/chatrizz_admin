import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { Notification } from "./fetch-notification";
import type { CreateNotificationPayload } from "./post-notification";

export type UpdateNotificationPayload = CreateNotificationPayload;
export type UpdateNotificationResponse = Notification;

export const useUpdateNotificationMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateNotificationResponse,
    Error,
    UpdateNotificationPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.patch<UpdateNotificationResponse>(
        ENDPOINTS.notifications.detail(id),
        payload,
      );
      return data;
    },
    // Covers both the list and this notification's detail query.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
};
