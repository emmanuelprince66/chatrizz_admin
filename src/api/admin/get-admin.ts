// src/api/admin/get-admin.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface Admin {
  id: string;
  full_name: string;
  email: string;
  role: "Administrator" | "Sub-admin";
  admin_role: string;
  is_active: boolean;
  created_at: string;
}

export const useFetchSingleAdminQuery = (
  id: string | null,
  options?: { enabled?: boolean },
) => {
  return useQuery<Admin, Error>({
    queryKey: ["admin", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const response = await axiosInstance.get<Admin>(`/admin/team/${id}/`);
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export type { Admin };
