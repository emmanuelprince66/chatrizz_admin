import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

export interface Group {
  id: string;
  name: string | null;
  description: string | null;
  members: number;
  approve_members: boolean;
}

export type GroupsApiResponse = PaginatedResponse<Group>;
export type FetchGroupsParams = ListParams;

export const useFetchGroupsQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchGroupsParams }) => {
  const queryParams = compactParams({
    search: params.search,
    page: params.page || 1,
    limit: params.limit || 15,
  });

  return useQuery<GroupsApiResponse, Error>({
    queryKey: queryKeys.groups.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<GroupsApiResponse>(
        ENDPOINTS.groups.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};
