import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import {
  compactParams,
  normalizeListResponse,
  type FlexibleListResponse,
} from "../utils";

export type MarketplaceProductStatus = "APPROVED" | "REJECTED";

export type ProductCategory =
  | "OTHERS"
  | "FASHION"
  | "ELECTRONICS"
  | "BEAUTY & SKINCARE"
  | "SERVICES";

export interface MarketplaceProduct {
  id: number;
  user: string;
  name: string;
  description: string | null;
  price: string;
  category: ProductCategory;
  location: string;
  media: string[];
  media_files: Array<{ id: number; file: string; media_type: "image" | "video" }>;
  created_at: string;
  is_promoted: boolean;
  average_rating: string | null;
  ratings_count: string | number;
  is_active: boolean;
  status: MarketplaceProductStatus;
}

export interface MarketplaceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MarketplaceProduct[];
}

export interface MarketplaceParams {
  search?: string;
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
}

export const useFetchMarketplaceQuery = (params: MarketplaceParams) => {
  const queryParams = compactParams({ ...params });

  return useQuery<MarketplaceResponse, Error>({
    queryKey: queryKeys.marketplace.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        FlexibleListResponse<MarketplaceProduct>
      >(ENDPOINTS.marketplace.list, { params: queryParams });
      const { count, next, previous, results } = normalizeListResponse(data);
      return { count, next, previous, results };
    },
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  });
};
