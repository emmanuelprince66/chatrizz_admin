import type { User } from "@/api/profile/fetch-user";
import { useSuspendUserMutation } from "@/api/profile/suspend-users";
import { getApiErrorMessage } from "@/api/utils";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
const UserActions = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const suspendUserMutation = useSuspendUserMutation();
  const isSuspended = user?.is_active === false;
  const isSuspending = suspendUserMutation.isPending;

  const handleSuspend = async () => {
    try {
      await suspendUserMutation.mutateAsync({ id: user.id });
      toast.success("User suspended successfully");
      setShowSuspendedModal(false);
    } catch (error) {
      toast.error("Failed to suspend user", {
        description: getApiErrorMessage(error),
      });
    }
  };

  return (
    <>
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
            onClick={() => setShowSuspendedModal(true)}
            disabled={isSuspended || isSuspending}
            className={`cursor-pointer px-4 py-2 transition-colors flex items-center`}
          >
            {isSuspended ? <>User Suspended</> : <>Suspend User</>}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigate(`/users/${user.id}`)}
            className={`cursor-pointer px-4 py-2 transition-colors flex items-center`}
          >
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`cursor-pointer px-4 py-2 text-red-500 transition-colors flex items-center`}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        isOpen={showSuspendedModal}
        onClose={() => setShowSuspendedModal(false)}
        onConfirm={handleSuspend}
        title="Confirm Suspend User"
        message={
          <>
            Are you sure you want to suspend{" "}
            <span className="font-semibold text-gray-900">
              {user.username || user.email}
            </span>
            ?
          </>
        }
        notice={{
          text: "This user will be suspended from using the platform.",
        }}
        tone="primary"
        confirmLabel="Suspend user"
        pendingLabel="Suspending..."
        isPending={isSuspending}
      />
    </>
  );
};

export const useUsersColumns = () => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "full_name",
      header: "Full Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="font-medium">
            {user.full_name || <span className="text-gray-400">-</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original;
        return <div className="text-sm text-gray-700">{user.email}</div>;
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="font-medium text-sm">
            {user.username || <span className="text-gray-400">-</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const user = row.original;
        // Parse location if it's in SRID format
        const formatLocation = (location: string | null) => {
          if (!location) return "-";
          if (location.includes("POINT")) {
            const coords = location.match(/\((.*?)\)/)?.[1]?.split(" ");
            return coords ? `${coords[1]}, ${coords[0]}` : location;
          }
          return location;
        };
        return (
          <div className="text-sm text-gray-600">
            {formatLocation(user.location)}
          </div>
        );
      },
    },
    {
      accessorKey: "followers",
      header: "Followers",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm font-medium text-gray-700">
            {user.followers.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="text-sm text-gray-600">
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "last_seen",
      header: "Last Seen",
      cell: ({ row }) => {
        const user = row.original;
        const getTimeAgo = (date: string) => {
          const now = new Date();
          const lastSeen = new Date(date);
          const diffMs = now.getTime() - lastSeen.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 1) return "Just now";
          if (diffMins < 60) return `${diffMins}m ago`;
          if (diffHours < 24) return `${diffHours}h ago`;
          if (diffDays < 7) return `${diffDays}d ago`;
          return lastSeen.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        };

        return (
          <div className="text-sm text-gray-600">
            {getTimeAgo(user.last_seen)}
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              user.is_active
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {user.is_active ? (
              <UserCheck className="h-3.5 w-3.5" />
            ) : (
              <UserX className="h-3.5 w-3.5" />
            )}
            {user.is_active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <UserActions user={row.original} />,
    },
  ];

  return columns;
};
