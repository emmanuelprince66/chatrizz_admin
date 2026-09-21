import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { MessageResponse } from "../types";
import { getApiErrorMessage } from "../utils";

export type VerificationDecision = "accept" | "reject";

export interface VerificationDecisionVariables {
  id: string;
  decision: VerificationDecision;
}

export const useVerificationDecisionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<MessageResponse, Error, VerificationDecisionVariables>({
    mutationFn: async ({ id, decision }) => {
      const { data } = await axiosInstance.get<MessageResponse>(
        ENDPOINTS.verifications.decision(id, decision),
      );
      return data;
    },
    onSuccess: (_, { decision }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.verifications.all });
      toast.success(
        decision === "accept"
          ? "Verification approved"
          : "Verification rejected",
      );
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to update verification request."),
      );
    },
  });
};
