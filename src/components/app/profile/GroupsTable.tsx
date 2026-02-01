import type { GroupsApiResponse } from "@/api/profile/fetch-groups";
import { CustomTable } from "@/components/app/CustomTable";
import { useMemo } from "react";
import { useGroupsColumns } from "./GroupsColunm";

interface GroupsTableProps {
  response: GroupsApiResponse | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  setPageSize?: (size: number) => void;
  pageSize?: number;
}

const GroupsTable = ({
  response,
  loading,
  setPage,
  page,
  setPageSize,
  pageSize = 15,
}: GroupsTableProps) => {
  const columns = useGroupsColumns();

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
      noDataText="No groups found. Try adjusting your search criteria."
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

export default GroupsTable;
