"use client";

import ReportsTable from "@/components/app/reports/ReportsTable";
import { SearchInput } from "@/components/app/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReportsHook } from "@/hooks/useReportsHook";
import React, { useEffect, useMemo, useState } from "react";

const Reports: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [reason, setReason] = useState("all");
  const [status, setStatus] = useState("all");
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
    const totalItems = ReportsData?.count || 0;
    const resultsCount = ReportsData?.results?.length || 0;

    return {
      totalItems,
      resultsCount,
    };
  }, [ReportsData]);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col w-full items-start sm:items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-cabinet font-[500] tracking-tight">
            Reports Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-md">
            Review and manage user-reported content violations.
          </p>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-3 items-center">
          <SearchInput
            placeholder="Search reports..."
            value={searchInput}
            onValueChange={setSearchInput}
            className="w-64 md:w-80"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[200px] border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {/* Reason Filter */}
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="w-full sm:w-[200px] border-gray-200">
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

          {/* Mobile Search */}
          <div className="md:hidden w-full">
            <SearchInput
              placeholder="Search reports..."
              value={searchInput}
              onValueChange={setSearchInput}
              className="w-full"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground font-medium">
          {ReportsDataLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              Loading reports...
            </span>
          ) : (
            `Showing ${displayInfo.resultsCount} of ${displayInfo.totalItems} reports`
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <ReportsTable
          response={ReportsData}
          loading={ReportsDataLoading}
          setPage={setPage}
          page={page}
          setPageSize={setPageSize}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
};

export default Reports;
