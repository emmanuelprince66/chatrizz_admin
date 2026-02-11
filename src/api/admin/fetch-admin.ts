// src/api/admin/fetch-admins.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

// Define types based on API response
interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: "Administrator" | "Sub-admin";
  admin_role: string;
  is_active: boolean;
  created_at: string;
}

interface AdminsApiResponse {
  links: {
    next: string | null;
    previous: string | null;
  };
  total: number;
  limit: number;
  pages: number;
  results: Admin[];
}

interface FetchAdminsParams {
  search?: string | null;
  page?: number;
  limit?: number;
}

interface UseFetchAdminsQueryOptions {
  params: FetchAdminsParams;
  enabled?: boolean;
}

export const useFetchAdminsQuery = ({
  params,
  enabled = true,
}: UseFetchAdminsQueryOptions) => {
  // Clean params - remove null/undefined/empty values
  const cleanParams = {
    ...(params.search && { search: params.search }),
    page: params.page || 1,
    limit: params.limit || 10,
  };

  return useQuery<AdminsApiResponse, Error>({
    queryKey: [
      "admins",
      cleanParams.page,
      cleanParams.search,
      cleanParams.limit,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<AdminsApiResponse>(
        "/admin/team/",
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
export type { Admin, AdminsApiResponse, FetchAdminsParams };
