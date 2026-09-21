import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { MessageResponse } from "../types";
import { getApiErrorMessage } from "../utils";

export type ProductDecision = "approve" | "reject";

export interface ProductStatusVariables {
  id: number;
  action: ProductDecision;
}

export const useProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, ProductStatusVariables>({
    mutationFn: async ({ id, action }) => {
      const { data } = await axiosInstance.get<MessageResponse>(
        ENDPOINTS.marketplace.productDecision(id, action),
      );
      return data;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.marketplace.all });
      toast.success(
        action === "approve" ? "Product approved" : "Product rejected",
      );
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Unable to update product status."));
    },
  });
};
