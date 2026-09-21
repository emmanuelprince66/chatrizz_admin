import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { Admin, AdminRole } from "./fetch-admin";

export interface CreateAdminPayload {
  full_name: string;
  email: string;
  role: AdminRole;
}

export type CreateAdminResponse = Admin;

export const useCreateAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAdminResponse, Error, CreateAdminPayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<CreateAdminResponse>(
        ENDPOINTS.admins.list,
        payload,
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all }),
  });
};
