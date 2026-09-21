import { PageHeader } from "@/components/app/PageHeader";
import ReportsTable from "@/components/app/reports/ReportsTable";
import { ResultsCount } from "@/components/app/ResultsCount";
import { SearchInput } from "@/components/app/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportReason, ReportStatus } from "@/api/reports/fetch-reports";
import { useReportsHook } from "@/hooks/useReportsHook";
import { useEffect, useMemo, useState } from "react";

type ReasonFilter = ReportReason | "all";
type StatusFilter = ReportStatus | "all";

const Reports = () => {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [reason, setReason] = useState<ReasonFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState(15);

  const { ReportsData, ReportsDataLoading } = useReportsHook({
    searchInput,
    page,
    reason: reason === "all" ? undefined : reason,
    status: status === "all" ? undefined : status,
    pageSize,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [reason, status, searchInput]);

  // Calculate display info
  const displayInfo = useMemo(() => {
    const totalItems = ReportsData?.total || 0;
    const resultsCount = ReportsData?.results?.length || 0;

    return {
      totalItems,
      resultsCount,
    };
  }, [ReportsData]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports Management"
        description="Review and manage user-reported content violations."
        actions={
          <>
            <SearchInput
              placeholder="Search reports..."
              value={searchInput}
              onValueChange={setSearchInput}
              className="w-full sm:w-64"
            />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StatusFilter)}
            >
              <SelectTrigger className="h-10 min-w-0 flex-1 rounded-full border-gray-200 bg-white sm:w-40 sm:flex-none">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={reason}
              onValueChange={(value) => setReason(value as ReasonFilter)}
            >
              <SelectTrigger className="h-10 min-w-0 flex-1 rounded-full border-gray-200 bg-white sm:w-44 sm:flex-none">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="hate">Hate Speech</SelectItem>
                <SelectItem value="violence">Violence</SelectItem>
                <SelectItem value="misinformation">Misinformation</SelectItem>
                <SelectItem value="nudity">Nudity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      <ResultsCount
        loading={ReportsDataLoading}
        shown={displayInfo.resultsCount}
        total={displayInfo.totalItems}
        label="reports"
      />

      <ReportsTable
        response={ReportsData}
        loading={ReportsDataLoading}
        setPage={setPage}
        page={page}
        setPageSize={setPageSize}
        pageSize={pageSize}
      />
    </div>
  );
};

export default Reports;
