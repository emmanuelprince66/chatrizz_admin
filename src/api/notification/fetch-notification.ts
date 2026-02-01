// src/api/notifications/fetch-notifications.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

// Define types based on API response
interface Notification {
  id: string;
  title: string;
  message: string;
  type: "ALL" | "ADMINS" | "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";
  channel: "IN-APP" | "PUSH" | "EMAIL";
  created_at: string;
}

interface NotificationsApiResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  total: number;
  limit: number;
  pages: number;
  results: Notification[];
}

interface FetchNotificationsParams {
  search?: string | null;
  type?: string;
  page?: number;
  limit?: number;
}

interface UseFetchNotificationsQueryOptions {
  params: FetchNotificationsParams;
  enabled?: boolean;
}

export const useFetchNotificationsQuery = ({
  params,
  enabled = true,
}: UseFetchNotificationsQueryOptions) => {
  // Clean params - remove null/undefined/empty values
  const cleanParams = {
    ...(params.search && { search: params.search }),
    ...(params.type && { type: params.type }),
    page: params.page || 1,
    limit: params.limit || 10,
  };

  return useQuery<NotificationsApiResponse, Error>({
    queryKey: [
      "notifications",
      cleanParams.page,
      cleanParams.search,
      cleanParams.type,
      cleanParams.limit,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get<NotificationsApiResponse>(
        "/admin/broadcast/",
        {
          params: cleanParams,
        },
      );
      return response.data;
    },

    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Export types for use in components
export type {
  FetchNotificationsParams,
  Notification,
  NotificationsApiResponse,
};
