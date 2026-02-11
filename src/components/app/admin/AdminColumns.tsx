// src/components/admin/AdminColumns.tsx

import type { Admin } from "@/api/admin/fetch-admin";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit2, MoreHorizontal, Trash2, UserCheck, UserX } from "lucide-react";

interface UseAdminColumnsProps {
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  onSuspend?: (id: string) => void;
}

export const useAdminColumns = ({
  onEdit,
  onDelete,
  onSuspend,
}: UseAdminColumnsProps) => {
  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => {
        const admin = row.original;
        return (
          <div className="font-medium text-gray-900">{admin.full_name}</div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const admin = row.original;
        return <div className="text-gray-600">{admin.email}</div>;
      },
    },
    {
      accessorKey: "admin_role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.admin_role;

        const getRoleConfig = (role: string) => {
          const configs: Record<string, { className: string; label: string }> =
            {
              "Super Admin": {
                className: "bg-[#0892D0] text-white border-[#0892D0]",
                label: "Super Admin",
              },
              Administrator: {
                className: "bg-blue-50 text-blue-700 border-blue-200",
                label: "Admin",
              },
              Moderator: {
                className: "bg-gray-50 text-gray-700 border-gray-200",
                label: "Moderator",
              },
            };

          return (
            configs[role] || {
              className: "bg-gray-50 text-gray-700 border-gray-200",
              label: role,
            }
          );
        };

        const config = getRoleConfig(role);

        return (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
            >
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date Created",
      cell: ({ row }) => {
        const admin = row.original;
        const date = new Date(admin.created_at);

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
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.is_active;

        return isActive ? (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs font-medium px-2.5 py-1">
            Active
          </Badge>
        ) : (
          <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 text-xs font-medium px-2.5 py-1">
            Inactive
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const admin = row.original;

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
              <DropdownMenuItem
                className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                onClick={() => onEdit(admin.id)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {onSuspend && (
                <DropdownMenuItem
                  className="cursor-pointer px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center"
                  onClick={() => onSuspend(admin.id)}
                >
                  {admin.is_active ? (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Suspend
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                  onClick={() => onDelete(admin.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
};
