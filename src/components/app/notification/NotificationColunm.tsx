// src/components/notifications/NotificationColumns.tsx

import type { Notification } from "@/api/notification/fetch-notification";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Bell,
  Edit2,
  Mail,
  MoreHorizontal,
  Send,
  Trash2,
  Users,
} from "lucide-react";

export const useNotificationColumns = () => {
  const columns: ColumnDef<Notification>[] = [
    {
      accessorKey: "id",
      header: "Notification ID",
      cell: ({ row }) => {
        const notification = row.original;
        const shortId = notification.id.split("-")[0];
        return <div className="font-medium text-gray-900">#{shortId}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Subject",
      cell: ({ row }) => {
        const notification = row.original;
        return (
          <div className="max-w-md">
            <p className="font-medium text-gray-900 truncate">
              {notification.title}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;

        const getTypeConfig = (type: string) => {
          const configs = {
            ALL: {
              icon: Users,
              className: "bg-blue-50 text-blue-700 border-blue-200",
              label: "All Users",
            },
            ADMINS: {
              icon: Users,
              className: "bg-purple-50 text-purple-700 border-purple-200",
              label: "Admins",
            },
            INDIVIDUAL: {
              icon: Users,
              className: "bg-green-50 text-green-700 border-green-200",
              label: "Individual",
            },
            BUSINESS: {
              icon: Users,
              className: "bg-orange-50 text-orange-700 border-orange-200",
              label: "Business",
            },
            ORGANIZATION: {
              icon: Users,
              className: "bg-pink-50 text-pink-700 border-pink-200",
              label: "Organization",
            },
          };

          return (
            configs[type as keyof typeof configs] || {
              icon: Users,
              className: "bg-gray-50 text-gray-700 border-gray-200",
              label: type,
            }
          );
        };

        const config = getTypeConfig(type);
        const Icon = config.icon;

        return (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "channel",
      header: "Audience",
      cell: ({ row }) => {
        const channel = row.original.channel;

        const getChannelConfig = (channel: string) => {
          const configs = {
            "IN-APP": {
              icon: Bell,
              className: "bg-blue-50 text-blue-700 border-blue-200",
              label: "In-App",
            },
            PUSH: {
              icon: Send,
              className: "bg-green-50 text-green-700 border-green-200",
              label: "Push",
            },
            EMAIL: {
              icon: Mail,
              className: "bg-purple-50 text-purple-700 border-purple-200",
              label: "Email",
            },
          };

          return (
            configs[channel as keyof typeof configs] || {
              icon: Bell,
              className: "bg-gray-50 text-gray-700 border-gray-200",
              label: channel,
            }
          );
        };

        const config = getChannelConfig(channel);
        const Icon = config.icon;

        return (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date Scheduled",
      cell: ({ row }) => {
        const notification = row.original;
        const date = new Date(notification.created_at);

        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => {
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs font-medium px-2.5 py-1">
            Sent
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        // const notification = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-200 shadow-lg min-w-[160px]"
            >
              <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
