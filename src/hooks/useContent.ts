import {
  useDeletePostMutation,
  useDeleteProductMutation,
  useDeleteReviewMutation,
} from "@/api/content/delete-content";
import { useFetchContentQuery } from "@/api/content/fetch-content";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseContentHookProps {
  searchInput?: string;
  page?: number;
  activeFilter?: string;
  pageSize?: number;
  onDeleteSuccess?: () => void;
  closeModal?: () => void;
}

export const useContentHook = ({
  searchInput,
  page,
  activeFilter,
  pageSize = 15,
  onDeleteSuccess,
}: UseContentHookProps) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  // Map filter to API type parameter (must be uppercase)
  const contentType = useMemo(() => {
    switch (activeFilter) {
      case "Posts":
        return "POST"; // Uppercase for API
      case "Products":
        return "PRODUCT"; // Uppercase for API
      case "Reviews":
        return "REVIEW"; // Uppercase for API
      default:
        return null;
    }
  }, [activeFilter]);

  const {
    data: ContentData,
    isLoading: ContentDataLoading,
    refetch: ContentDataRefetch,
    isFetching: ContentDataFetching,
    isError: ContentDataError,
  } = useFetchContentQuery({
    params: {
      search: searchTerm,
      page,
      limit: pageSize,
      type: contentType,
    },
    enabled: true,
  });

  // Delete mutations
  const deletePostMutation = useDeletePostMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const deleteReviewMutation = useDeleteReviewMutation();

  // Delete handlers with optional onClose callback
  const handleDeletePost = (id: string | number, onClose?: () => void) => {
    console.log("delete post loading");
    deletePostMutation.mutate(id, {
      onSuccess: () => {
        onClose?.();
        onDeleteSuccess?.();
      },
      onError: () => {},
    });
  };

  const handleDeleteProduct = (id: string | number, onClose?: () => void) => {
    deleteProductMutation.mutate(id, {
      onSuccess: () => {
        onClose?.();
        onDeleteSuccess?.();
      },
    });
  };

  const handleDeleteReview = (id: string | number, onClose?: () => void) => {
    deleteReviewMutation.mutate(id, {
      onSuccess: () => {
        onClose?.();
        onDeleteSuccess?.();
      },
    });
  };

  return {
    ContentData,
    ContentDataRefetch,
    ContentDataLoading: ContentDataLoading || ContentDataFetching,
    ContentDataError,
    // Delete functions
    handleDeletePost,
    handleDeleteProduct,
    handleDeleteReview,
    // Delete states
    isDeletePostPending: deletePostMutation.isPending,
    isDeleteProductPending: deleteProductMutation.isPending,
    isDeleteReviewPending: deleteReviewMutation.isPending,
  };
};
