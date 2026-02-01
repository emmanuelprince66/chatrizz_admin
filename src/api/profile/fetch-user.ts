// src/api/profile/fetch-users.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

// Define types based on actual API response
interface User {
  id: string;
  full_name: string | null;
  email: string;
  username: string | null;
  location: string | null;
  followers: number;
  created_at: string;
  last_seen: string;
  is_active: boolean;
}

interface PaginationLinks {
  next: string | null;
  previous: string | null;
}

interface UsersApiResponse {
  links: PaginationLinks;
  total: number;
  limit: number;
  pages: number;
  results: User[];
}

interface FetchUsersParams {
  search?: string | null;
  page?: number;
  limit?: number;
}

interface UseFetchUsersQueryOptions {
  params: FetchUsersParams;
  enabled?: boolean;
}

export const useFetchUsersQuery = ({
  params,
  enabled = true,
}: UseFetchUsersQueryOptions) => {
  // Clean params - remove null/undefined values
  const cleanParams = {
    ...(params.search && { search: params.search }),
    page: params.page || 1,
    limit: params.limit || 15,
  };

  return useQuery<UsersApiResponse, Error>({
    queryKey: [
      "users",
      cleanParams.page,
      cleanParams.search,
      cleanParams.limit,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get<UsersApiResponse>(
        "/admin/users/",
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
export type { FetchUsersParams, User, UsersApiResponse };
