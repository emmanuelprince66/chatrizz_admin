import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { Admin } from "./fetch-admin";
import type { CreateAdminPayload } from "./post-admin";

export type UpdateAdminPayload = CreateAdminPayload;
export type UpdateAdminResponse = Admin;

export const useUpdateAdminMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateAdminResponse, Error, UpdateAdminPayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.patch<UpdateAdminResponse>(
        ENDPOINTS.admins.detail(id),
        payload,
      );
      return data;
    },
    // Covers both the list and this admin's detail query.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all }),
  });
};
