import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";

export const useSuspendAdminMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await axiosInstance.post(ENDPOINTS.admins.suspend(id));
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.admins.all }),
  });
};
