import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "../axios";

// Response interfaces
interface DeleteResponse {
  message?: string;
  success?: boolean;
}

// API endpoints
const deletePost = async (id: string | number): Promise<DeleteResponse> => {
  const response = await axiosInstance.post<DeleteResponse>(
    `/admin/delete_post/${id}/`,
  );
  return response.data;
};

const deleteProduct = async (id: string | number): Promise<DeleteResponse> => {
  const response = await axiosInstance.post<DeleteResponse>(
    `/admin/delete_product/${id}/`,
  );
  return response.data;
};

const deleteReview = async (id: string | number): Promise<DeleteResponse> => {
  const response = await axiosInstance.post<DeleteResponse>(
    `/admin/delete_review/${id}/`,
  );
  return response.data;
};

// Mutation hooks
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string | number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      console.error("Delete post error:", error);
      toast.error("Failed to delete post");
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string | number>({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteResponse, Error, string | number>({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Review deleted successfully");
    },
    onError: (error) => {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review");
    },
  });
};

export type { DeleteResponse };
