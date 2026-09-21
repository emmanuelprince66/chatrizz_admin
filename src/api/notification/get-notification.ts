import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { QueryOptions } from "../types";
import type { Notification } from "./fetch-notification";

export const useFetchSingleNotificationQuery = (
  id: string | null | undefined,
  options?: QueryOptions,
) =>
  useQuery<Notification, Error>({
    queryKey: queryKeys.notifications.detail(id),
    queryFn: async () => {
      if (!id) throw new Error("Notification id is required");
      const { data } = await axiosInstance.get<Notification>(
        ENDPOINTS.notifications.detail(id),
      );
      return data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });

export type { Notification };
