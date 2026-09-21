import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { Notification } from "./fetch-notification";

export type CreateNotificationPayload = Pick<
  Notification,
  "title" | "message" | "type" | "channel"
>;

export type CreateNotificationResponse = Notification;

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateNotificationResponse,
    Error,
    CreateNotificationPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<CreateNotificationResponse>(
        ENDPOINTS.notifications.list,
        payload,
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
};
