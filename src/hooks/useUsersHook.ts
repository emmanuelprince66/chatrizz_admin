import { useFetchGroupsQuery } from "@/api/profile/fetch-groups";
import { useFetchUsersQuery } from "@/api/profile/fetch-user";
import { useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseUsersHookProps {
  searchInput: string;
  page: number;
  activeFilter: string;
  pageSize?: number;
}

export const useUsersHook = ({
  searchInput,
  page,
  activeFilter,
  pageSize = 15,
}: UseUsersHookProps) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  const isUsersActive = activeFilter === "Users";

  // Fetch users only when Users tab is active
  const {
    data: UsersData,
    isLoading: UsersDataLoading,
    refetch: UsersDataRefetch,
    isFetching: UsersDataFetching,
    isError: UsersDataError,
  } = useFetchUsersQuery({
    params: {
      search: searchTerm,
      page,
      limit: pageSize,
    },
    enabled: isUsersActive,
  });

  // Fetch groups only when Groups tab is active
  const {
    data: GroupsData,
    isLoading: GroupsDataLoading,
    refetch: GroupsDataRefetch,
    isFetching: GroupsDataFetching,
    isError: GroupsDataError,
  } = useFetchGroupsQuery({
    params: {
      search: searchTerm,
      page,
      limit: pageSize,
    },
    enabled: !isUsersActive,
  });

  return {
    UsersData,
    GroupsData,
    UsersDataRefetch,
    GroupsDataRefetch,
    UsersDataLoading: UsersDataLoading || UsersDataFetching,
    GroupsDataLoading: GroupsDataLoading || GroupsDataFetching,
    UsersDataError,
    GroupsDataError,
  };
};
