import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

export type AdminRole = "Administrator" | "Sub-admin";

export interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  admin_role: string;
  is_active: boolean;
  created_at: string;
}

export type AdminsApiResponse = PaginatedResponse<Admin>;
export type FetchAdminsParams = ListParams;

export const useFetchAdminsQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchAdminsParams }) => {
  const queryParams = compactParams({
    search: params.search,
    page: params.page || 1,
    limit: params.limit || 10,
  });

  return useQuery<AdminsApiResponse, Error>({
    queryKey: queryKeys.admins.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<AdminsApiResponse>(
        ENDPOINTS.admins.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};
