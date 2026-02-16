// src/components/notifications/CreateNotification.tsx

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
import { Textarea } from "@/components/ui/textarea";
import { useNotifications } from "@/hooks/useNotifications";
import { Controller } from "react-hook-form";

interface CreateNotificationProps {
  onClose: () => void;
  notificationId?: string | null;
}

const CreateNotification = ({
  onClose,
  notificationId,
}: CreateNotificationProps) => {
  const {
    form,
    onSubmit,
    isFormLoading: isLoading,
    isEditMode,
    isFetchingNotification,
  } = useNotifications({
    notificationId,
    onSuccess: onClose,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  // Show loading state while fetching notification data
  if (isFetchingNotification) {
    return (
      <div className="space-y-6 p-6">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Message Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-32 w-full" /> {/* Textarea */}
        </div>

        {/* Type Select Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Select */}
        </div>

        {/* Channel Select Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Select */}
        </div>

        {/* Button Group Skeleton */}
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-20" /> {/* Cancel Button */}
          <Skeleton className="h-10 w-32" /> {/* Submit Button */}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-1 w-full ">
      {/* Title Field */}
      <div className="space-y-2 w-full">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Enter announcement title"
          {...register("title")}
          disabled={isLoading}
          className={`w-full ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Enter your announcement message"
          {...register("message")}
          disabled={isLoading}
          rows={4}
          className={`w-full resize-none ${errors.message ? "border-red-500" : ""}`}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {/* Type Select */}
      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium text-gray-700">
          Select Type
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`w-full ${errors.type ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Users</SelectItem>
                <SelectItem value="ADMINS">Admins</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                <SelectItem value="BUSINESS">Business</SelectItem>
                <SelectItem value="ORGANIZATION">Organization</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.type && (
          <p className="text-xs text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Audience (Channel) Select */}
      <div className="space-y-2">
        <Label htmlFor="channel" className="text-sm font-medium text-gray-700">
          Audience
        </Label>
        <Controller
          name="channel"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoading}
            >
              <SelectTrigger
                className={`w-full ${errors.channel ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN-APP">In-App Notification</SelectItem>
                <SelectItem value="PUSH">Push Notification</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.channel && (
          <p className="text-xs text-red-600">{errors.channel.message}</p>
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
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 rounded-full mr-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>{isEditMode ? "Update Announcement" : "Send Announcement"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateNotification;
