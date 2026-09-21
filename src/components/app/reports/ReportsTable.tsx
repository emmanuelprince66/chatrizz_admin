import type { ReportsApiResponse } from "@/api/reports/fetch-reports";
import { CustomTable } from "@/components/app/CustomTable";
import { useMemo } from "react";
import { useReportsRecentColumns } from "./ReportsColunm";

interface ReportsTableProps {
  response: ReportsApiResponse | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  setPageSize?: (size: number) => void;
  pageSize?: number;
}

const ReportsTable = ({
  response,
  loading,
  setPage,
  page,
  setPageSize,
  pageSize = 15,
}: ReportsTableProps) => {
  const columns = useReportsRecentColumns();

  const paginationData = useMemo(
    () => ({
      currentPage: page,
      totalPages: response?.pages || 1,
      pageSize: response?.limit || pageSize,
      results: response?.results || [],
    }),
    [response, page, pageSize],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (setPageSize) {
      setPageSize(newSize);
    }
    setPage(1);
  };

  return (
    <CustomTable
      loading={loading}
      noDataText="No reports found. Try adjusting your filters."
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

export default ReportsTable;
