import { useFetchOverviewQuery } from "@/api/overview/fetch-overview";
import moment from "moment";
import type { DateRange } from "react-day-picker";
import { useDebounce } from "./useDebounce";

export const useOverviewHook = ({
  dateRange,
  page,
  searchInput,
}: {
  dateRange: DateRange | undefined;
  page: number;
  searchInput: string;
}) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const searchTerm =
    (debouncedSearchTerm?.length || 0) >= 3 || debouncedSearchTerm?.length === 0
      ? debouncedSearchTerm
      : null;

  const {
    data: OverviewData,
    isLoading: OverviewDataLoading,
    refetch: OverviewDataRefetch,
  } = useFetchOverviewQuery({
    params: {
      search: searchTerm,
      page,
      limit: 15,
      start_date: dateRange?.from
        ? moment(dateRange.from).format("YYYY-MM-DD")
        : undefined,
      end_date: dateRange?.to
        ? moment(dateRange.to).format("YYYY-MM-DD")
        : undefined,
    },
  });

  console.log("overview", OverviewData);

  return { OverviewData, OverviewDataLoading, OverviewDataRefetch };
};
