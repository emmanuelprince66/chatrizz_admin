import GroupsTable from "@/components/app/profile/GroupsTable";
import UsersTable from "@/components/app/profile/UsersTable";
import { SearchInput } from "@/components/app/SearchContact";
import { Button } from "@/components/ui/button";
import { useUsersHook } from "@/hooks/useUsersHook";
import { useEffect, useMemo, useState } from "react";

const Profile = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState("Users");
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

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchInput(""); // Clear search when switching tabs
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col w-full items-start sm:items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-cabinet font-[500] tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-md">
            Manage and monitor all user accounts and groups in your system.
          </p>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
          <SearchInput
            placeholder={`Search ${activeFilter.toLowerCase()}...`}
            value={searchInput}
            onValueChange={setSearchInput}
            className="w-full sm:w-64 md:w-80 max-w-md"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-3">
            <Button
              onClick={() => handleFilterChange("Users")}
              className="min-w-[100px] transition-all"
              style={{
                backgroundColor:
                  activeFilter === "Users" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Users" ? "white" : "black",
              }}
            >
              Users
            </Button>
            <Button
              onClick={() => handleFilterChange("Groups")}
              className="min-w-[100px] transition-all"
              style={{
                backgroundColor:
                  activeFilter === "Groups" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Groups" ? "white" : "black",
              }}
            >
              Groups
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground font-medium">
          {currentLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              Loading...
            </span>
          ) : (
            `Showing ${resultsCount} of ${totalCount} ${activeFilter.toLowerCase()}`
          )}
        </div>
      </div>

      {/* Table */}
      <div className="">
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
