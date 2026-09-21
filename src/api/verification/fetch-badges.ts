import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import {
  compactParams,
  normalizeListResponse,
  type FlexibleListResponse,
} from "../utils";

export type BadgeType = "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";
export type BillingPeriod = "monthly" | "yearly";
export type Currency = "NGN" | "GHS" | "GBP" | "USD" | "KES";

export interface VerificationBadgePrice {
  id?: string;
  currency: Currency;
  amount: string;
}

export interface VerificationBadgePlan {
  id?: string;
  billing_period: BillingPeriod;
  prices: VerificationBadgePrice[];
}

export interface VerificationBadgeFeatures {
  online_identity_protection?: boolean;
  influencer_growth?: boolean;
  better_discovery?: boolean;
  boost_instant_trust?: boolean;
  boost_visibility?: boolean;
  higher_convertion_rate?: boolean;
  brand_credibility?: boolean;
  prevent_impersonation?: boolean;
  authenticity?: boolean;
  stronger_community_presence?: boolean;
  public_relations?: boolean;
}

export interface VerificationBadge extends VerificationBadgeFeatures {
  id: string;
  rank: number | null;
  type: BadgeType;
  plans: VerificationBadgePlan[];
}

export interface VerificationBadgesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VerificationBadge[];
}

export interface VerificationBadgesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const useFetchVerificationBadgesQuery = (
  params: VerificationBadgesParams = {},
) => {
  const queryParams = compactParams({ ...params });

  return useQuery<VerificationBadgesResponse, Error>({
    queryKey: queryKeys.badges.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        FlexibleListResponse<VerificationBadge>
      >(ENDPOINTS.badges.list, { params: queryParams });
      const { count, next, previous, results } = normalizeListResponse(data);
      return { count, next, previous, results };
    },
    staleTime: 60_000,
  });
};
