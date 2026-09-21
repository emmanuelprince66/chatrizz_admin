import ContentTable from "@/components/app/content/ContentTable";
import { SearchInput } from "@/components/app/SearchInput";
import { FilterPills } from "@/components/app/FilterPills";
import { PageHeader } from "@/components/app/PageHeader";
import { ResultsCount } from "@/components/app/ResultsCount";
import { useContentHook, type ContentFilter } from "@/hooks/useContent";
import { useEffect, useMemo, useState } from "react";

const FILTERS: readonly ContentFilter[] = ["Posts", "Products", "Reviews"];

const ContentModeration = () => {
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentFilter>("Posts");
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

  const handleFilterChange = (filter: ContentFilter) => {
    setActiveFilter(filter);
    setSearchInput(""); // Clear search when switching tabs
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Moderation"
        description="Manage and monitor all content across the platform."
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
