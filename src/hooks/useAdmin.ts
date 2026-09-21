import { useFetchAdminsQuery } from "@/api/admin/fetch-admin";
import { useFetchSingleAdminQuery } from "@/api/admin/get-admin";
import { useCreateAdminMutation } from "@/api/admin/post-admin";
import { useSuspendAdminMutation } from "@/api/admin/suspend-admin";
import { useUpdateAdminMutation } from "@/api/admin/update-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/api/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useDebounce } from "./useDebounce";
import { useSearchTerm } from "./useSearchTerm";

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
  const searchTerm = useSearchTerm(useDebounce(searchInput, 500));

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
    } catch (error) {
      const action = isEditMode ? "update" : "create";
      toast.error(`Failed to ${action} admin`, {
        description: getApiErrorMessage(error),
      });
    }
  };

  // Suspend handler
  const handleSuspend = async (id: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toast.success("Admin status updated successfully");
    } catch (error) {
      toast.error("Failed to suspend admin", {
        description: getApiErrorMessage(error),
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
    handleSuspend,
    isSuspending: suspendMutation.isPending,
  };
};
