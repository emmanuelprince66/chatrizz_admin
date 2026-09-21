import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { VerificationBadge } from "./fetch-badges";

export type BadgePlanPayload = Omit<VerificationBadge, "id">;

export interface UpdateBadgeVariables {
  id: string;
  payload: BadgePlanPayload;
}

export const useVerificationBadgeMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.badges.all });

  const create = useMutation<VerificationBadge, Error, BadgePlanPayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<VerificationBadge>(
        ENDPOINTS.badges.list,
        payload,
      );
      return data;
    },
    onSuccess: invalidate,
  });

  const update = useMutation<VerificationBadge, Error, UpdateBadgeVariables>({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosInstance.patch<VerificationBadge>(
        ENDPOINTS.badges.detail(id),
        payload,
      );
      return data;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await axiosInstance.delete(ENDPOINTS.badges.detail(id));
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
};
