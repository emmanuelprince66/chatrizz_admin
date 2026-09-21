import { useFetchGroupsQuery } from "@/api/profile/fetch-groups";
import { useFetchUsersQuery } from "@/api/profile/fetch-user";
import { useDebounce } from "./useDebounce";
import { useSearchTerm } from "./useSearchTerm";

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
  const searchTerm = useSearchTerm(useDebounce(searchInput, 500));

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
