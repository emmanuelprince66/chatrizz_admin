// src/api/reports/resolve-report.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface ResolveReportParams {
  id: string;
}

interface ResolveReportResponse {
  id: string;
  status: string;
  message?: string;
}

export const useResolveReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ResolveReportResponse, Error, ResolveReportParams>({
    mutationFn: async ({ id }: ResolveReportParams) => {
      const response = await axiosInstance.get<ResolveReportResponse>(
        `/admin/resolve_report/${id}/`,
      );
      return response.data;
    },

    onSuccess: () => {
      // Invalidate and refetch all reports queries
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },

    onError: (error) => {
      console.error("Failed to resolve report:", error);
    },
  });
};
