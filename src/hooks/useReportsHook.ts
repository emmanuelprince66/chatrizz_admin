import { useFetchReportsQuery } from "@/api/reports/fetch-reports";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseReportsHookProps {
  searchInput: string;
  page: number;
  reason?: string;
  status?: string;
  pageSize?: number;
}

export const useReportsHook = ({
  searchInput,
  page,
  reason,
  status,
  pageSize = 15,
}: any) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  const {
    data: ReportsData,
    isLoading: ReportsDataLoading,
    refetch: ReportsDataRefetch,
    isFetching: ReportsDataFetching,
    isError: ReportsDataError,
  } = useFetchReportsQuery({
    params: {
      search: searchTerm,
      status: status && status !== "all" ? status : undefined,
      reason: reason && reason !== "all" ? reason : undefined,
      page,
      limit: pageSize,
    },
  });

  return {
    ReportsData,
    ReportsDataLoading: ReportsDataLoading || ReportsDataFetching,
    ReportsDataRefetch,
    ReportsDataError,
  };
};
