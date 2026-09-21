import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { MessageResponse } from "../types";
import { getApiErrorMessage } from "../utils";

export type DeleteResponse = MessageResponse;

type ContentId = string | number;

const useDeleteContentMutation = (
  getEndpoint: (id: ContentId) => string,
  label: "Post" | "Product" | "Review",
) => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, ContentId>({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.post<DeleteResponse>(getEndpoint(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.all });
      // Content also appears on the author's profile page.
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(`${label} deleted successfully`);
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, `Failed to delete ${label.toLowerCase()}`),
      );
    },
  });
};

export const useDeletePostMutation = () =>
  useDeleteContentMutation(ENDPOINTS.content.deletePost, "Post");

export const useDeleteProductMutation = () =>
  useDeleteContentMutation(ENDPOINTS.content.deleteProduct, "Product");

export const useDeleteReviewMutation = () =>
  useDeleteContentMutation(ENDPOINTS.content.deleteReview, "Review");
