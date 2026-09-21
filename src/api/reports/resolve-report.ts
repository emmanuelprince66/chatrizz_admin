import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";

export interface ResolveReportParams {
  id: string;
}

export interface ResolveReportResponse {
  id: string;
  status: string;
  message?: string;
}

export const useResolveReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ResolveReportResponse, Error, ResolveReportParams>({
    mutationFn: async ({ id }) => {
      const { data } = await axiosInstance.get<ResolveReportResponse>(
        ENDPOINTS.reports.resolve(id),
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      // The overview dashboard lists recent reports too.
      queryClient.invalidateQueries({ queryKey: queryKeys.overview.all });
    },
  });
};
