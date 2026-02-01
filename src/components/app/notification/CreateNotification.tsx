// src/components/notifications/CreateNotification.tsx

import { useCreateNotificationMutation } from "@/api/notification/post-notification";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

type NotificationFormData = z.infer<typeof notificationSchema>;

interface CreateNotificationProps {
  onClose: () => void;
}

const CreateNotification = ({ onClose }: CreateNotificationProps) => {
  const createNotificationMutation = useCreateNotificationMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: "",
      message: "",
      type: undefined,
      channel: undefined,
    },
  });

  const onSubmit = async (data: NotificationFormData) => {
    try {
      await createNotificationMutation.mutateAsync(data);

      toast.success("Announcement created successfully");

      reset();
      onClose();
    } catch (error: any) {
      toast.error("Failed to create announcement", {
        description:
          error?.response?.data?.message ||
          "Please try again or contact support if the issue persists.",
      });
    }
  };

  const isLoading = isSubmitting || createNotificationMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Title Field */}
      <div className="space-y-2">
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
          <p className="text-sm text-red-600">{errors.title.message}</p>
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
          <p className="text-sm text-red-600">{errors.message.message}</p>
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
          <p className="text-sm text-red-600">{errors.type.message}</p>
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
          <p className="text-sm text-red-600">{errors.channel.message}</p>
        )}
      </div>

      {/* Schedule Field (Optional - for future implementation) */}
      <div className="space-y-2">
        <Label htmlFor="schedule" className="text-sm font-medium text-gray-700">
          Schedule
        </Label>
        <Select disabled>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Send immediately" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Send immediately</SelectItem>
            <SelectItem value="scheduled">Schedule for later</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Scheduling feature coming soon. All announcements will be sent
          immediately.
        </p>
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
            <>
              <Spinner size="sm" color="text-white" className="mr-2" />
              Sending...
            </>
          ) : (
            "Send Announcement"
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateNotification;
