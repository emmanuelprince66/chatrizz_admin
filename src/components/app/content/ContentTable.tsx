import type {
  ContentApiResponse,
  PostContent,
  ProductContent,
  ReviewContent,
} from "@/api/content/fetch-content";
import { CustomTable } from "@/components/app/CustomTable";
import { useMemo } from "react";
import { usePostsColumns } from "./PostsColunms";
import { useProductsColumns } from "./ProductsColunm";
import { useReviewsColumns } from "./ReviewColunms";

interface ContentTableProps {
  response: ContentApiResponse | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  setPageSize?: (size: number) => void;
  pageSize?: number;
  contentType: "Posts" | "Products" | "Reviews";
}

const ContentTable = ({
  response,
  loading,
  setPage,
  page,
  setPageSize,
  pageSize = 15,
  contentType,
}: ContentTableProps) => {
  const postsColumns = usePostsColumns();
  const productsColumns = useProductsColumns();
  const reviewsColumns = useReviewsColumns();

  // Memoize pagination values to prevent unnecessary recalculations
  const paginationData = useMemo(() => {
    return {
      currentPage: page,
      totalPages: response?.pages || 1,
      totalItems: response?.total || 0,
      pageSize: response?.limit || pageSize,
      results: response?.results || [],
    };
  }, [response, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (setPageSize) {
      setPageSize(newSize);
    }
    setPage(1); // Reset to first page when changing page size
  };

  const tableProps = {
    loading,
    noDataText: `No ${contentType.toLowerCase()} found. Try adjusting your search criteria or filter.`,
    pagination: {
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
      pageSize: paginationData.pageSize,
      onPageChange: handlePageChange,
      onPageSizeChange: handlePageSizeChange,
    },
  };

  // The list is requested with `type` matching `contentType`, so every row is that kind.
  switch (contentType) {
    case "Products":
      return (
        <CustomTable
          {...tableProps}
          columns={productsColumns}
          data={paginationData.results as ProductContent[]}
        />
      );
    case "Reviews":
      return (
        <CustomTable
          {...tableProps}
          columns={reviewsColumns}
          data={paginationData.results as ReviewContent[]}
        />
      );
    default:
      return (
        <CustomTable
          {...tableProps}
          columns={postsColumns}
          data={paginationData.results as PostContent[]}
        />
      );
  }
};

export default ContentTable;
