// src/api/notifications/get-notification.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ALL" | "ADMINS" | "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";
  channel: "IN-APP" | "PUSH" | "EMAIL";
  created_at: string;
}

interface FetchSingleNotificationConfig {
  enabled?: boolean;
}

export const useFetchSingleNotificationQuery = (
  id: string | null | undefined,
  config?: FetchSingleNotificationConfig,
) => {
  return useQuery<Notification, Error>({
    queryKey: ["notification", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const response = await axiosInstance.get<Notification>(
        `/admin/single_broadcast/${id}`,
      );
      return response.data;
    },
    enabled: config?.enabled !== undefined ? config.enabled : !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export type { Notification };
