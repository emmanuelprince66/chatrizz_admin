// src/components/admin/AdminTable.tsx

import type { AdminsApiResponse } from "@/api/admin/fetch-admin";
import { CustomTable } from "@/components/app/CustomTable";
import { useMemo } from "react";
import { useAdminColumns } from "./AdminColumns";

interface AdminTableProps {
  response: AdminsApiResponse | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  setPageSize?: (size: number) => void;
  pageSize?: number;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onSuspend?: (id: string) => void;
}

const AdminTable = ({
  response,
  loading,
  setPage,
  page,
  setPageSize,
  pageSize = 10,
  onEdit,
  onDelete,
  onSuspend,
}: AdminTableProps) => {
  const columns = useAdminColumns({ onEdit, onDelete, onSuspend });

  // Calculate pagination from total
  const paginationData = useMemo(() => {
    const totalItems = response?.total || 0;
    const currentPageSize = pageSize;
    const totalPages = Math.ceil(totalItems / currentPageSize);

    return {
      currentPage: page,
      totalPages: totalPages || 1,
      totalItems,
      pageSize: currentPageSize,
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
    setPage(1);
  };

  return (
    <CustomTable
      loading={loading}
      noDataText="No admins found. Try adjusting your filters or create a new admin."
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

export default AdminTable;
