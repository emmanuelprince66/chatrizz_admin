import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

export type AccountType = "INDIVIDUAL" | "BUSINESS" | "ORGANIZATION";

export interface User {
  id: string;
  full_name: string | null;
  email: string;
  username: string | null;
  type: AccountType;
  location: string | null;
  followers: number;
  created_at: string;
  last_seen: string;
  is_active: boolean;
  is_online: boolean;
}

export type UsersApiResponse = PaginatedResponse<User>;
export type FetchUsersParams = ListParams;

export const useFetchUsersQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchUsersParams }) => {
  const queryParams = compactParams({
    search: params.search,
    page: params.page || 1,
    limit: params.limit || 15,
  });

  return useQuery<UsersApiResponse, Error>({
    queryKey: queryKeys.users.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<UsersApiResponse>(
        ENDPOINTS.users.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};
