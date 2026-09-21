import { useFetchOverviewQuery } from "@/api/overview/fetch-overview";
import moment from "moment";
import type { DateRange } from "react-day-picker";
import { useDebounce } from "./useDebounce";
import { useSearchTerm } from "./useSearchTerm";

const OVERVIEW_PAGE_SIZE = 15;

const formatDate = (date?: Date) =>
  date ? moment(date).format("YYYY-MM-DD") : undefined;

export const useOverviewHook = ({
  dateRange,
  page,
  searchInput,
}: {
  dateRange: DateRange | undefined;
  page: number;
  searchInput: string;
}) => {
  const searchTerm = useSearchTerm(useDebounce(searchInput, 500));

  const {
    data: OverviewData,
    isLoading: OverviewDataLoading,
    refetch: OverviewDataRefetch,
  } = useFetchOverviewQuery({
    params: {
      search: searchTerm,
      page,
      limit: OVERVIEW_PAGE_SIZE,
      start_date: formatDate(dateRange?.from),
      end_date: formatDate(dateRange?.to),
    },
  });

  return { OverviewData, OverviewDataLoading, OverviewDataRefetch };
};
