// src/components/admin/CreateAdminForm.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAdmins } from "@/hooks/useAdmin";
import { Controller } from "react-hook-form";

interface CreateAdminFormProps {
  onClose: () => void;
  adminId?: string | null;
}

const CreateAdminForm = ({ onClose, adminId }: CreateAdminFormProps) => {
  const {
    form,
    onSubmit,
    isFormLoading: isLoading,
    isEditMode,
    isFetchingAdmin,
  } = useAdmins({
    adminId,
    onSuccess: onClose,
    enableForm: true,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  // Show loading state while fetching admin data
  if (isFetchingAdmin) {
    return (
      <div className="space-y-6 p-6">
        {/* Full Name Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Email Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Role Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Button Group Skeleton */}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6">
      {/* Full Name Field */}
      <div className="space-y-2">
        <Label
          htmlFor="full_name"
          className="text-sm font-medium text-gray-700"
        >
          Full Name
        </Label>
        <Input
          id="full_name"
          placeholder="Enter full name"
          {...register("full_name")}
          disabled={isLoading}
          className={`w-full ${errors.full_name ? "border-red-500" : ""}`}
        />
        {errors.full_name && (
          <p className="text-sm text-red-600">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          {...register("email")}
          disabled={isLoading}
          className={`w-full ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium text-gray-700">
          Role
        </Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`w-full ${errors.role ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrator">Administration</SelectItem>
                <SelectItem value="Sub-admin">Sub Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#0892D0] hover:bg-[#0892D0]/90 text-white px-6 py-2"
        >
          {isLoading ? (
            <Spinner className="w-7 h-7 " color="white" />
          ) : (
            <>{isEditMode ? "Update Admin" : "Create Admin"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateAdminForm;
