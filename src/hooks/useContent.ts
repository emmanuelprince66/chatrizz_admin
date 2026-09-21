import { useFetchContentQuery } from "@/api/content/fetch-content";
import { useDebounce } from "./useDebounce";
import { useSearchTerm } from "./useSearchTerm";

export type ContentFilter = "Posts" | "Products" | "Reviews";

const CONTENT_TYPE_BY_FILTER: Record<ContentFilter, string> = {
  Posts: "POST",
  Products: "PRODUCT",
  Reviews: "REVIEW",
};

interface UseContentHookProps {
  searchInput?: string;
  page?: number;
  activeFilter?: ContentFilter;
  pageSize?: number;
}

export const useContentHook = ({
  searchInput,
  page,
  activeFilter,
  pageSize = 15,
}: UseContentHookProps) => {
  const searchTerm = useSearchTerm(useDebounce(searchInput, 500));

  const {
    data: ContentData,
    isLoading,
    isFetching,
    refetch: ContentDataRefetch,
    isError: ContentDataError,
  } = useFetchContentQuery({
    params: {
      search: searchTerm,
      page,
      limit: pageSize,
      type: activeFilter ? CONTENT_TYPE_BY_FILTER[activeFilter] : null,
    },
  });

  return {
    ContentData,
    ContentDataRefetch,
    ContentDataLoading: isLoading || isFetching,
    ContentDataError,
  };
};
