import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import {
  compactParams,
  normalizeListResponse,
  type FlexibleListResponse,
} from "../utils";

export interface AdminPayment {
  id: string;
  amount: number | string;
  source: string;
  status: string;
  created_at: string;
  user: {
    id?: string;
    full_name?: string;
    username?: string;
  } | null;
}

export interface PaymentMetrics {
  total_revenue: number;
  badge_payment: number;
  ads: number;
}

export interface PaymentsResponse {
  count: number;
  totalPages: number;
  next: string | null;
  previous: string | null;
  results: AdminPayment[];
  metrics: PaymentMetrics;
}

export interface PaymentsParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: "UNPAID" | "PAID";
  type?: "BADGE" | "ADS";
}

export const useFetchPaymentsQuery = (params: PaymentsParams = {}) => {
  const queryParams = compactParams({ ...params });

  return useQuery<PaymentsResponse, Error>({
    queryKey: queryKeys.payments.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        FlexibleListResponse<AdminPayment, Partial<PaymentMetrics>>
      >(ENDPOINTS.payments.list, { params: queryParams });
      const { nested, ...list } = normalizeListResponse(data);

      return {
        ...list,
        metrics: {
          total_revenue: nested?.total_revenue ?? 0,
          badge_payment: nested?.badge_payment ?? 0,
          ads: nested?.ads ?? 0,
        },
      };
    },
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  });
};
