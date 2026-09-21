import GroupsTable from "@/components/app/profile/GroupsTable";
import UsersTable from "@/components/app/profile/UsersTable";
import { ResultsCount } from "@/components/app/ResultsCount";
import { SearchInput } from "@/components/app/SearchInput";
import { FilterPills } from "@/components/app/FilterPills";
import { PageHeader } from "@/components/app/PageHeader";
import { useUsersHook } from "@/hooks/useUsersHook";
import { useEffect, useMemo, useState } from "react";

const FILTERS = ["Users", "Groups"] as const;
type ProfileFilter = (typeof FILTERS)[number];

const Profile = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<ProfileFilter>("Users");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { UsersData, GroupsData, UsersDataLoading, GroupsDataLoading } =
    useUsersHook({
      activeFilter,
      searchInput,
      page,
      pageSize,
    });

  // Reset pagination when switching tabs or searching
  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchInput]);

  const isUsers = activeFilter === "Users";

  // Memoize current data and loading state
  const { currentLoading, resultsCount, totalCount } = useMemo(() => {
    const data = isUsers ? UsersData : GroupsData;
    const loading = isUsers ? UsersDataLoading : GroupsDataLoading;

    return {
      currentData: data,
      currentLoading: loading,
      resultsCount: data?.results?.length || 0,
      totalCount: data?.total || 0,
    };
  }, [isUsers, UsersData, GroupsData, UsersDataLoading, GroupsDataLoading]);

  const handleFilterChange = (filter: ProfileFilter) => {
    setActiveFilter(filter);
    setSearchInput(""); // Clear search when switching tabs
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage and monitor all user accounts and groups."
        actions={
          <SearchInput
            placeholder={`Search ${activeFilter.toLowerCase()}...`}
            value={searchInput}
            onValueChange={setSearchInput}
            className="w-full sm:w-80"
          />
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          options={FILTERS}
          value={activeFilter}
          onChange={handleFilterChange}
        />
        <ResultsCount
          loading={currentLoading}
          shown={resultsCount}
          total={totalCount}
          label={activeFilter.toLowerCase()}
        />
      </div>

      {/* Table */}
      <div>
        {isUsers ? (
          <UsersTable
            response={UsersData}
            loading={currentLoading}
            setPage={setPage}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        ) : (
          <GroupsTable
            response={GroupsData}
            loading={currentLoading}
            setPage={setPage}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
