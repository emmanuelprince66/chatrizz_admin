import type { ContentApiResponse } from "@/api/content/fetch-content";
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

  // Select the appropriate columns based on content type
  const columns = useMemo(() => {
    switch (contentType) {
      case "Posts":
        return postsColumns;
      case "Products":
        return productsColumns;
      case "Reviews":
        return reviewsColumns;
      default:
        return postsColumns;
    }
  }, [contentType, postsColumns, productsColumns, reviewsColumns]);

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

  return (
    <CustomTable
      loading={loading}
      noDataText={`No ${contentType.toLowerCase()} found. Try adjusting your search criteria or filter.`}
      columns={columns}
      data={paginationData.results}
      pagination={{
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        pageSize: paginationData.pageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      }}
    />
  );
};

export default ContentTable;
