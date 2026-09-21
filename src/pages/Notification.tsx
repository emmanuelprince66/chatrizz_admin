import { CustomModal } from "@/components/app/CustomModal";
import CreateNotification from "@/components/app/notification/CreateNotification";
import NotificationTable from "@/components/app/notification/NotificationTable";
import { PageHeader } from "@/components/app/PageHeader";
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
import { Plus } from "lucide-react";
import { useState } from "react";

const NotificationPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState("all");
  const [editingNotificationId, setEditingNotificationId] = useState<
    string | null
  >(null);

  const { NotificationsData, NotificationsDataLoading } = useNotifications({
    searchInput: searchValue,
    page,
    type: typeFilter,
    pageSize,
  });

  const openCreate = () => {
    setEditingNotificationId(null);
    setIsModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditingNotificationId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNotificationId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        description="Send and manage notifications to your users."
        actions={
          <>
            <SearchInput
              placeholder="Search announcements..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="w-full sm:w-64"
            />
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-full border-gray-200 bg-white sm:w-44">
                <SelectValue placeholder="Filter by audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All audiences</SelectItem>
                <SelectItem value="ALL">All Users</SelectItem>
                <SelectItem value="ADMINS">Admins</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={openCreate}
              className="h-10 w-full rounded-full px-5 sm:w-auto"
            >
              <Plus />
              Create Announcement
            </Button>
          </>
        }
      />

      <NotificationTable
        response={NotificationsData}
        loading={NotificationsDataLoading}
        setPage={setPage}
        page={page}
        setPageSize={setPageSize}
        pageSize={pageSize}
        onEdit={openEdit}
      />

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingNotificationId ? "Edit Announcement" : "Create New Announcement"
        }
        description={
          editingNotificationId
            ? "Update the announcement details"
            : "Send a notification to your users"
        }
      >
        <CreateNotification
          onClose={closeModal}
          notificationId={editingNotificationId}
        />
      </CustomModal>
    </div>
  );
};

export default NotificationPage;
