import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import {
  compactParams,
  normalizeListResponse,
  type FlexibleListResponse,
} from "../utils";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type VerificationType = "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";

export interface AdminVerification {
  id: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    username: string | null;
    bio: string | null;
  };
  type: VerificationType;
  status: VerificationStatus;
  created_at: string;
  nin: string | null;
  social_media: string | null;
  goverment_id: string | null;
  business_document: string | null;
}

export interface VerificationMetrics {
  active_users?: number;
  active_badge?: number;
  inactive_users?: number;
  individual?: number;
  business?: number;
  organization?: number;
}

export interface VerificationsResponse {
  count: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: AdminVerification[];
  metrics: VerificationMetrics;
}

export interface VerificationParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: VerificationStatus;
}

const METRIC_KEYS: Array<keyof VerificationMetrics> = [
  "active_users",
  "active_badge",
  "inactive_users",
  "individual",
  "business",
  "organization",
];

const pickMetrics = (source: VerificationMetrics = {}): VerificationMetrics =>
  Object.fromEntries(
    METRIC_KEYS.filter((key) => typeof source[key] === "number").map((key) => [
      key,
      source[key],
    ]),
  );

export const useFetchVerificationsQuery = (params: VerificationParams) => {
  const queryParams = compactParams({ ...params });

  return useQuery<VerificationsResponse, Error>({
    queryKey: queryKeys.verifications.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        FlexibleListResponse<AdminVerification, VerificationMetrics>
      >(ENDPOINTS.verifications.list, { params: queryParams });
      const { nested, ...list } = normalizeListResponse(data);

      return { ...list, metrics: pickMetrics(nested) };
    },
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  });
};
