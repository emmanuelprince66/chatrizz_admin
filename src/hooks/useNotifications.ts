// src/hooks/useNotifications.ts

import { useFetchNotificationsQuery } from "@/api/notification/fetch-notification";
import { useFetchSingleNotificationQuery } from "@/api/notification/get-notification";
import { useCreateNotificationMutation } from "@/api/notification/post-notification";
import { useUpdateNotificationMutation } from "@/api/notification/update-notification";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useDebounce } from "./useDebounce";

// Validation schema
const notificationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  message: z.string().min(1, "Message is required"),
  type: z
    .enum(["ALL", "ADMINS", "INDIVIDUAL", "BUSINESS", "ORGANIZATION"])
    .refine((val) => !!val, "Please select a type"),
  channel: z
    .enum(["IN-APP", "PUSH", "EMAIL"])
    .refine((val) => !!val, "Please select an audience"),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;

interface UseNotificationsProps {
  // For list/table
  searchInput?: string;
  page?: number;
  type?: string;
  pageSize?: number;

  // For form (create/edit)
  notificationId?: string | null;
  onSuccess?: () => void;
  enableForm?: boolean; // Flag to enable form logic
}

export const useNotifications = ({
  searchInput = "",
  page = 1,
  type,
  pageSize = 10,
  notificationId,
  onSuccess,
  enableForm = false,
}: UseNotificationsProps = {}) => {
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  console.log("notificationId------3", notificationId);

  // Only search if input is 3+ characters or empty (to show all)
  const searchTerm = useMemo(() => {
    const trimmedSearch = debouncedSearchTerm?.trim() || "";
    return trimmedSearch.length >= 3 || trimmedSearch.length === 0
      ? trimmedSearch
      : null;
  }, [debouncedSearchTerm]);

  // List notifications query
  const {
    data: NotificationsData,
    isLoading: NotificationsDataLoading,
    refetch: NotificationsDataRefetch,
    isFetching: NotificationsDataFetching,
    isError: NotificationsDataError,
  } = useFetchNotificationsQuery({
    params: {
      search: searchTerm,
      type: type && type !== "all" ? type : undefined,
      page,
      limit: pageSize,
    },
  });

  // Form logic (only when enableForm is true)
  const isEditMode = !!notificationId;

  // Single notification query (for editing)
  const { data: notificationData, isLoading: isFetchingNotification } =
    useFetchSingleNotificationQuery(notificationId, {
      enabled: isEditMode,
    });

  console.log("notificationData", notificationData);

  // Mutations
  const createMutation = useCreateNotificationMutation();
  const updateMutation = useUpdateNotificationMutation(notificationId || "");

  // Form setup
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: undefined,
      channel: undefined,
    },
  });

  const { reset, handleSubmit, formState } = form;

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && notificationData) {
      console.log("notificationData0-----3", notificationData);
      reset({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        channel: notificationData.channel,
      });
    }
  }, [notificationData, isEditMode, reset, enableForm]);

  // Submit handler
  const onSubmit = async (data: NotificationFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
        toast.success("Announcement updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Announcement created successfully");
      }

      reset();
      onSuccess?.();
    } catch (error: any) {
      const action = isEditMode ? "update" : "create";
      toast.error(`Failed to ${action} announcement`, {
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
    isFetchingNotification;

  return {
    // List/Table data
    NotificationsData,
    NotificationsDataLoading:
      NotificationsDataLoading || NotificationsDataFetching,
    NotificationsDataRefetch,
    NotificationsDataError,

    // Form data (only relevant when enableForm is true)
    form,
    onSubmit: handleSubmit(onSubmit),
    isFormLoading,
    isEditMode,
    isFetchingNotification,
  };
};
