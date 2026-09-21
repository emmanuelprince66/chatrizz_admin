import { BackLink } from "@/components/app/BackLink";
import { CustomModal } from "@/components/app/CustomModal";
import { PageHeader } from "@/components/app/PageHeader";
import { SearchInput } from "@/components/app/SearchInput";
import { Button } from "@/components/ui/button";
import { useAdmins } from "@/hooks/useAdmin";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateAdminForm from "./AdminForm";
import AdminTable from "./AdminTable";

const AdminManagementPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

  // Use the admins hook
  const { AdminsData, AdminsDataLoading, handleSuspend } = useAdmins({
    searchInput: searchValue,
    page,
    pageSize,
  });

  // Handle edit
  const handleEdit = (id: string) => {
    setEditingAdminId(id);
    setIsCreateModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingAdminId(null);
  };

  return (
    <div className="space-y-6">
      <BackLink to="/settings" label="Settings" />

      <PageHeader
        title="Admin Management"
        description="Manage administrators and their permissions."
        actions={
          <>
            <SearchInput
              placeholder="Search admins..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="w-full sm:w-72"
            />
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 w-full rounded-full px-5 sm:w-auto"
            >
              <Plus />
              Create Admin
            </Button>
          </>
        }
      />

      <AdminTable
        response={AdminsData}
        loading={AdminsDataLoading}
        setPage={setPage}
        page={page}
        setPageSize={setPageSize}
        pageSize={pageSize}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
      />

      <CustomModal
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        title={
          editingAdminId ? "Edit Administrator" : "Create New Administrator"
        }
        description={
          editingAdminId
            ? "Update the administrator details"
            : "Add a new administrator to your system"
        }
      >
        <CreateAdminForm
          onClose={handleModalClose}
          adminId={editingAdminId}
        />
      </CustomModal>
    </div>
  );
};

export default AdminManagementPage;
