import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { MessageResponse } from "../types";

export interface SuspendUserPayload {
  id: string;
}

export type SuspendUserResponse = MessageResponse;

export const useSuspendUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SuspendUserResponse, Error, SuspendUserPayload>({
    mutationFn: async ({ id }) => {
      const { data } = await axiosInstance.post<SuspendUserResponse>(
        ENDPOINTS.users.suspend(id),
      );
      return data;
    },
    // Refreshes the users list and this user's profile.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};
