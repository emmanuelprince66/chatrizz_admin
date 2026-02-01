// src/components/notifications/NotificationTable.tsx

import type { NotificationsApiResponse } from "@/api/notification/fetch-notification";
import { CustomTable } from "@/components/app/CustomTable";
import { useMemo } from "react";
import { useNotificationColumns } from "./NotificationColunm";

interface NotificationTableProps {
  response: NotificationsApiResponse | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  setPageSize?: (size: number) => void;
  pageSize?: number;
}

const NotificationTable = ({
  response,
  loading,
  setPage,
  page,
  setPageSize,
  pageSize = 10,
}: NotificationTableProps) => {
  const columns = useNotificationColumns();

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
      noDataText="No announcements found. Try adjusting your filters or create a new announcement."
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

export default NotificationTable;
