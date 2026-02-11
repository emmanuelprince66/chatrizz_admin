// src/hooks/useAdmins.ts

import { useFetchAdminsQuery } from "@/api/admin/fetch-admin";
import { useFetchSingleAdminQuery } from "@/api/admin/get-admin";
import { useCreateAdminMutation } from "@/api/admin/post-admin";
import { useSuspendAdminMutation } from "@/api/admin/suspend-admin";
import { useUpdateAdminMutation } from "@/api/admin/update-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useDebounce } from "./useDebounce";

// Validation schema
const adminSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(200, "Full name must be less than 200 characters"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  role: z
    .enum(["Administrator", "Sub-admin"])
    .refine((val) => !!val, "Please select a role"),
});

export type AdminFormData = z.infer<typeof adminSchema>;

interface UseAdminsProps {
  // For list/table
  searchInput?: string;
  page?: number;
  pageSize?: number;

  // For form (create/edit)
  adminId?: string | null;
  onSuccess?: () => void;
  enableForm?: boolean; // Flag to enable form logic
}

export const useAdmins = ({
  searchInput = "",
  page = 1,
  pageSize = 10,
  adminId,
  onSuccess,
  enableForm = false,
}: UseAdminsProps = {}) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  // List admins query
  const {
    data: AdminsData,
    isLoading: AdminsDataLoading,
    refetch: AdminsDataRefetch,
    isFetching: AdminsDataFetching,
    isError: AdminsDataError,
  } = useFetchAdminsQuery({
    params: {
      search: searchTerm,
      page,
      limit: pageSize,
    },
  });

  // Form logic (only when enableForm is true)
  const isEditMode = !!adminId;

  // Single admin query (for editing)
  const { data: adminData, isLoading: isFetchingAdmin } =
    useFetchSingleAdminQuery(adminId || null, {
      enabled: isEditMode && enableForm,
    });

  // Mutations
  const createMutation = useCreateAdminMutation();
  const updateMutation = useUpdateAdminMutation(adminId || "");
  //   const deleteMutation = useDeleteAdminMutation();
  const suspendMutation = useSuspendAdminMutation();

  // Form setup
  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: undefined,
    },
  });

  const { reset, handleSubmit, formState } = form;

  // Populate form when editing
  useEffect(() => {
    if (enableForm && isEditMode && adminData) {
      reset({
        full_name: adminData.full_name,
        email: adminData.email,
        role: adminData.role,
      });
    }
  }, [adminData, isEditMode, reset, enableForm]);

  // Submit handler
  const onSubmit = async (data: AdminFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
        toast.success("Admin updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Admin created successfully");
      }

      reset();
      onSuccess?.();
    } catch (error: any) {
      const action = isEditMode ? "update" : "create";
      toast.error(`Failed to ${action} admin`, {
        description:
          error?.response?.data?.message ||
          error?.response?.data?.email?.[0] ||
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  // Delete handler
  //   const handleDelete = async (id: string) => {
  //     try {
  //       //   await deleteMutation.mutateAsync(id);
  //       toast.success("Admin deleted successfully");
  //     } catch (error: any) {
  //       toast.error("Failed to delete admin", {
  //         description:
  //           error?.response?.data?.message ||
  //           "Please try again or contact support if the issue persists.",
  //       });
  //     }
  //   };

  // Suspend handler
  const handleSuspend = async (id: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toast.success("Admin status updated successfully");
    } catch (error: any) {
      toast.error("Failed to suspend admin", {
        description:
          error?.response?.data?.message ||
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const isFormLoading =
    formState.isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending ||
    isFetchingAdmin;

  return {
    // List/Table data
    AdminsData,
    AdminsDataLoading: AdminsDataLoading || AdminsDataFetching,
    AdminsDataRefetch,
    AdminsDataError,

    // Form data (only relevant when enableForm is true)
    form,
    onSubmit: handleSubmit(onSubmit),
    isFormLoading,
    isEditMode,
    isFetchingAdmin,

    // Actions
    // handleDelete,
    handleSuspend,
    // isDeleting: deleteMutation.isPending,
    isSuspending: suspendMutation.isPending,
  };
};
