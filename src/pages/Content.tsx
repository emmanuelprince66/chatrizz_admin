import ContentTable from "@/components/app/content/ContentTable";
import { SearchInput } from "@/components/app/SearchContact";
import { Button } from "@/components/ui/button";
import { useContentHook } from "@/hooks/useContent";
import { useEffect, useMemo, useState } from "react";

const ContentModeration = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "Posts" | "Products" | "Reviews"
  >("Posts");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { ContentData, ContentDataLoading } = useContentHook({
    activeFilter,
    searchInput,
    page,
    pageSize,
  });

  // Reset pagination when switching tabs or searching
  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchInput]);

  // Memoize current data and loading state
  const { currentLoading, resultsCount, totalCount } = useMemo(() => {
    return {
      currentLoading: ContentDataLoading,
      resultsCount: ContentData?.results?.length || 0,
      totalCount: ContentData?.total || 0,
    };
  }, [ContentData, ContentDataLoading]);

  const handleFilterChange = (filter: "Posts" | "Products" | "Reviews") => {
    setActiveFilter(filter);
    setSearchInput(""); // Clear search when switching tabs
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col w-full items-start sm:items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-cabinet font-[500] tracking-tight">
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-md">
            Manage and monitor all content across your platform.
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
              onClick={() => handleFilterChange("Posts")}
              className="min-w-[100px] transition-all"
              style={{
                backgroundColor:
                  activeFilter === "Posts" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Posts" ? "white" : "black",
              }}
            >
              Posts
            </Button>
            <Button
              onClick={() => handleFilterChange("Products")}
              className="min-w-[100px] transition-all"
              style={{
                backgroundColor:
                  activeFilter === "Products" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Products" ? "white" : "black",
              }}
            >
              Products
            </Button>
            <Button
              onClick={() => handleFilterChange("Reviews")}
              className="min-w-[100px] transition-all"
              style={{
                backgroundColor:
                  activeFilter === "Reviews" ? "#0892D0" : "#EEF0F1",
                color: activeFilter === "Reviews" ? "white" : "black",
              }}
            >
              Reviews
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
        <ContentTable
          response={ContentData}
          loading={currentLoading}
          setPage={setPage}
          page={page}
          setPageSize={setPageSize}
          pageSize={pageSize}
          contentType={activeFilter}
        />
      </div>
    </div>
  );
};

export default ContentModeration;
