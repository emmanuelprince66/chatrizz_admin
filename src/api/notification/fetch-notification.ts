import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

export type NotificationAudience =
  | "ALL"
  | "ADMINS"
  | "INDIVIDUAL"
  | "BUSINESS"
  | "ORGANIZATION";

export type NotificationChannel = "IN-APP" | "PUSH" | "EMAIL";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationAudience;
  channel: NotificationChannel;
  created_at: string;
}

export type NotificationsApiResponse = PaginatedResponse<Notification>;

export interface FetchNotificationsParams extends ListParams {
  type?: string;
}

export const useFetchNotificationsQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchNotificationsParams }) => {
  const queryParams = compactParams({
    search: params.search,
    type: params.type,
    page: params.page || 1,
    limit: params.limit || 10,
  });

  return useQuery<NotificationsApiResponse, Error>({
    queryKey: queryKeys.notifications.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<NotificationsApiResponse>(
        ENDPOINTS.notifications.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};
