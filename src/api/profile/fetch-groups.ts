// src/api/profile/fetch-groups.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

// Define types based on actual API response
interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  created_at?: string;
  updated_at?: string;
}

interface PaginationLinks {
  next: string | null;
  previous: string | null;
}

interface GroupsApiResponse {
  links: PaginationLinks;
  total: number;
  limit: number;
  pages: number;
  results: Group[];
}

interface FetchGroupsParams {
  search?: string | null;
  page?: number;
  limit?: number;
}

interface UseFetchGroupsQueryOptions {
  params: FetchGroupsParams;
  enabled?: boolean;
}

export const useFetchGroupsQuery = ({
  params,
  enabled = true,
}: UseFetchGroupsQueryOptions) => {
  // Clean params - remove null/undefined values
  const cleanParams = {
    ...(params.search && { search: params.search }),
    page: params.page || 1,
    limit: params.limit || 15,
  };

  return useQuery<GroupsApiResponse, Error>({
    queryKey: [
      "groups",
      cleanParams.page,
      cleanParams.search,
      cleanParams.limit,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get<GroupsApiResponse>(
        "/admin/groups/",
        {
          params: cleanParams,
        },
      );
      return response.data;
    },

    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Changed to false to prevent unnecessary refetches
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Export types for use in components
export type { FetchGroupsParams, Group, GroupsApiResponse };
