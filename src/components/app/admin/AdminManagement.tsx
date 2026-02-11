// src/pages/AdminManagementPage.tsx

"use client";

import { CustomModal } from "@/components/app/CustomModal";
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
  // const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  // Use the admins hook
  const {
    AdminsData,
    AdminsDataLoading,
    // handleDelete,
    handleSuspend,
    // isDeleting,
  } = useAdmins({
    searchInput: searchValue,
    page,
    pageSize,
  });

  // Handle edit
  const handleEdit = (id: string) => {
    setEditingAdminId(id);
    setIsCreateModalOpen(true);
  };

  // Handle delete confirmation
  // const handleDeleteClick = (id: string) => {
  //   setDeletingAdminId(id);
  // };

  // const confirmDelete = async () => {
  //   if (deletingAdminId) {
  //     await handleDelete(deletingAdminId);
  //     setDeletingAdminId(null);
  //   }
  // };

  // Handle modal close
  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingAdminId(null);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-[500] text-gray-900 mb-2">
            Admin Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage administrators and their permissions
          </p>
        </div>

        {/* Search and Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <SearchInput
            placeholder="Search admins..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full sm:w-80"
          />

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#0892D0] hover:bg-[#0892D0]/90 text-white whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Admin
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <AdminTable
            response={AdminsData}
            loading={AdminsDataLoading}
            setPage={setPage}
            page={page}
            setPageSize={setPageSize}
            pageSize={pageSize}
            onEdit={handleEdit}
            onDelete={() => {}}
            onSuspend={handleSuspend}
          />
        </div>

        {/* Create/Edit Admin Modal */}
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
          trigger={false}
        >
          <CreateAdminForm
            onClose={handleModalClose}
            adminId={editingAdminId}
          />
        </CustomModal>

        {/* Delete Confirmation Dialog */}
        {/* <AlertDialog
          open={!!deletingAdminId}
          onOpenChange={() => setDeletingAdminId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the admin
                account and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
      </div>
    </div>
  );
};

export default AdminManagementPage;
