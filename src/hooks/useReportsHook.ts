import {
  useFetchReportsQuery,
  type ReportReason,
  type ReportStatus,
} from "@/api/reports/fetch-reports";
import { useDebounce } from "./useDebounce";
import { useSearchTerm } from "./useSearchTerm";

interface UseReportsHookProps {
  searchInput: string;
  page: number;
  reason?: ReportReason;
  status?: ReportStatus;
  pageSize?: number;
}

export const useReportsHook = ({
  searchInput,
  page,
  reason,
  status,
  pageSize = 15,
}: UseReportsHookProps) => {
  const searchTerm = useSearchTerm(useDebounce(searchInput, 500));

  const {
    data: ReportsData,
    isLoading: ReportsDataLoading,
    refetch: ReportsDataRefetch,
    isFetching: ReportsDataFetching,
    isError: ReportsDataError,
  } = useFetchReportsQuery({
    params: {
      search: searchTerm,
      status,
      reason,
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
