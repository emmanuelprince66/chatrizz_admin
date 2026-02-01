// src/hooks/useNotifications.ts

import { useFetchNotificationsQuery } from "@/api/notification/fetch-notification";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseNotificationsHookProps {
  searchInput: string;
  page: number;
  type?: string;
  pageSize?: number;
}

export const useNotifications = ({
  searchInput,
  page,
  type,
  pageSize = 10,
}: UseNotificationsHookProps) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  const {
    data: NotificationsData,
    isLoading: NotificationsDataLoading,
    refetch: NotificationsDataRefetch,
    isFetching: NotificationsDataFetching,
    isError: NotificationsDataError,
  } = useFetchNotificationsQuery({
    params: {
      search: searchTerm,
      type: type && type !== "all" ? type : undefined,
      page,
      limit: pageSize,
    },
  });

  return {
    NotificationsData,
    NotificationsDataLoading:
      NotificationsDataLoading || NotificationsDataFetching,
    NotificationsDataRefetch,
    NotificationsDataError,
  };
};
