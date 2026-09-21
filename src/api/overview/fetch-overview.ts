import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { Report } from "../reports/fetch-reports";
import { compactParams } from "../utils";

export interface OverviewTrendPoint {
  day: string;
  count: number;
}

export interface OverviewTrend {
  posts?: OverviewTrendPoint[];
  comments?: OverviewTrendPoint[];
  likes?: OverviewTrendPoint[];
  shares?: OverviewTrendPoint[];
}

export type OverviewReport = Pick<
  Report,
  "id" | "content_type" | "reason" | "status" | "reporter" | "created_at"
>;

export interface OverviewData {
  total_users?: number;
  active_users?: number;
  total_posts?: number;
  engagement_rate?: number;
  change_engagement_rate?: number;
  trend?: OverviewTrend;
  reports?: OverviewReport[];
  data?: { limit?: number; pages?: number; total?: number };
  [key: string]: unknown;
}

export interface FetchOverviewParams {
  search?: string | null;
  page: number;
  limit: number;
  start_date?: string;
  end_date?: string;
}

export const useFetchOverviewQuery = ({
  params,
}: {
  params: FetchOverviewParams;
}) => {
  const queryParams = compactParams({ ...params });

  return useQuery<OverviewData, Error>({
    queryKey: queryKeys.overview.summary(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<OverviewData>(
        ENDPOINTS.overview,
        { params: queryParams },
      );
      return data;
    },
    // Dashboard numbers should be current when the admin returns to the tab.
    refetchOnWindowFocus: true,
  });
};
