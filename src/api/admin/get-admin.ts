import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { QueryOptions } from "../types";
import type { Admin } from "./fetch-admin";

export const useFetchSingleAdminQuery = (
  id: string | null,
  options?: QueryOptions,
) =>
  useQuery<Admin, Error>({
    queryKey: queryKeys.admins.detail(id),
    queryFn: async () => {
      if (!id) throw new Error("Admin id is required");
      const { data } = await axiosInstance.get<Admin>(ENDPOINTS.admins.detail(id));
      return data;
    },
    enabled: !!id && (options?.enabled ?? true),
  });

export type { Admin };
