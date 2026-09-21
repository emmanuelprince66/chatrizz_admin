import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { MessageResponse } from "../types";

export interface RemoveBadgePayload {
  id: string;
}

export type RemoveBadgeResponse = MessageResponse;

export const useRemoveBadgeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveBadgeResponse, Error, RemoveBadgePayload>({
    mutationFn: async ({ id }) => {
      const { data } = await axiosInstance.get<RemoveBadgeResponse>(
        ENDPOINTS.users.removeBadge(id),
      );
      return data;
    },
    // Refreshes the users list and this user's profile.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};
