import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

export interface Reporter {
  username: string;
  id: string;
}

export type ReportReason =
  | "spam"
  | "harassment"
  | "hate"
  | "violence"
  | "misinformation"
  | "nudity"
  | "other";

export type ReportStatus = "PROCESSING" | "RESOLVED";

export interface Report {
  id: string;
  content_type: string;
  target_id: string;
  reason: ReportReason;
  details: string | null;
  count: number;
  status: ReportStatus;
  reporter: Reporter;
  created_at: string;
}

export type ReportsApiResponse = PaginatedResponse<Report>;

export interface FetchReportsParams extends ListParams {
  status?: ReportStatus;
  reason?: ReportReason;
}

export const useFetchReportsQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchReportsParams }) => {
  const queryParams = compactParams({
    search: params.search,
    status: params.status,
    reason: params.reason,
    page: params.page || 1,
    limit: params.limit || 15,
  });

  return useQuery<ReportsApiResponse, Error>({
    queryKey: queryKeys.reports.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ReportsApiResponse>(
        ENDPOINTS.reports.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};
