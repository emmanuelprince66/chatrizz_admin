"use client";

import { CustomModal } from "@/components/app/CustomModal";
import CreateNotification from "@/components/app/notification/CreateNotification";
import NotificationTable from "@/components/app/notification/NotificationTable";
import { SearchInput } from "@/components/app/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications } from "@/hooks/useNotifications";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

const NotificationPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Use the notifications hook
  const { NotificationsData, NotificationsDataLoading } = useNotifications({
    searchInput: searchValue,
    page,
    type: typeFilter,
    pageSize,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900 mb-6">
            Announcements
          </h1>

          {/* Search, Filters, and Create Button */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <SearchInput
                placeholder="Search announcements..."
                value={searchValue}
                onValueChange={setSearchValue}
                className="w-full sm:w-80"
              />

              {/* Filter Toggle Button (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Type Filter */}
              <div className="min-w-[180px]">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ALL">All Users</SelectItem>
                    <SelectItem value="ADMINS">Admins</SelectItem>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create Button */}
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#0892D0] hover:bg-[#0892D0]/90 text-white whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </div>

            {/* Mobile Create Button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="lg:hidden w-full bg-[#0892D0] hover:bg-[#0892D0]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </div>

          {/* Mobile Filters (Collapsible) */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ALL">All Users</SelectItem>
                    <SelectItem value="ADMINS">Admins</SelectItem>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="BUSINESS">Business</SelectItem>
                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setTypeFilter("all");
                  setSearchValue("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Active Filters Display */}
          {(typeFilter !== "all" || searchValue) && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {typeFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Type: {typeFilter}
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchValue && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{searchValue}"
                  <button
                    onClick={() => setSearchValue("")}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <NotificationTable
            response={NotificationsData}
            loading={NotificationsDataLoading}
            setPage={setPage}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </div>

        {/* Create Notification Modal */}
        <CustomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Announcement"
          description="Send a notification to your users"
          trigger={false}
        >
          <CreateNotification onClose={() => setIsCreateModalOpen(false)} />
        </CustomModal>
      </div>
    </div>
  );
};

export default NotificationPage;
