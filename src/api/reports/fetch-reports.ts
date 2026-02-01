// src/api/reports/fetch-reports.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

// Define types based on actual API response
interface Reporter {
  username: string;
  id: string;
}

interface Report {
  id: string;
  post: string;
  reason:
    | "spam"
    | "harassment"
    | "hate"
    | "violence"
    | "misinformation"
    | "nudity"
    | "other";
  details: string | null;
  status: "PROCESSING" | "RESOLVED";
  reporter: Reporter;
  created_at: string;
}

interface ReportsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Report[];
}

interface FetchReportsParams {
  search?: string | null;
  status?: string;
  reason?: string;
  page?: number;
  limit?: number;
}

interface UseFetchReportsQueryOptions {
  params: FetchReportsParams;
  enabled?: boolean;
}

export const useFetchReportsQuery = ({
  params,
  enabled = true,
}: UseFetchReportsQueryOptions) => {
  // Clean params - remove null/undefined/empty values
  const cleanParams = {
    ...(params.search && { search: params.search }),
    ...(params.status && { status: params.status }),
    ...(params.reason && { reason: params.reason }),
    page: params.page || 1,
    limit: params.limit || 15,
  };

  return useQuery<ReportsApiResponse, Error>({
    queryKey: [
      "reports",
      cleanParams.page,
      cleanParams.search,
      cleanParams.status,
      cleanParams.reason,
      cleanParams.limit,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get<ReportsApiResponse>(
        "/admin/reports/",
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
export type { FetchReportsParams, Report, Reporter, ReportsApiResponse };
