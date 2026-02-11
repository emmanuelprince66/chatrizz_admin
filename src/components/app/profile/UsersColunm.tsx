import { useSuspendUserMutation } from "@/api/profile/suspend-users";
import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { type ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Info,
  MoreHorizontal,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ViewProfile from "./ViewProfile";

// Define the UserInfo type based on the API response
interface UserInfo {
  id: string;
  full_name: string | null;
  email: string;
  username: string | null;
  location: string | null;
  followers: number;
  created_at: string;
  last_seen: string;
  is_active: boolean;
}

export const useUsersColumns = () => {
  const columns: ColumnDef<UserInfo>[] = [
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
      cell: ({ row }) => {
        const user = row.original;
        const [showSuspendedModal, setShowSuspendedModal] = useState(false);
        const [showViewProfile, setShowViewProfile] = useState(false);
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
              description:
                "Please try again or contact support if the issue persists.",
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
                  onClick={() => setShowViewProfile(true)}
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

            {/* Suspend Modal */}
            <CustomModal
              isOpen={showSuspendedModal}
              onClose={() => setShowSuspendedModal(false)}
              trigger={false}
              title="Confirm Suspend User"
            >
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to suspend{" "}
                  <span className="font-semibold text-gray-900">
                    {user?.username || user?.email}
                  </span>
                  ?
                </p>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-700 mt-1">
                        This user will be suspended from using the platform. Are
                        you sure?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSuspendedModal(false)}
                    disabled={isSuspending}
                    className="px-4 py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSuspend}
                    disabled={isSuspending}
                    className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSuspending ? (
                      <>
                        <Spinner size={"sm"} color="text-white" />
                        Suspending...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Suspend user
                      </>
                    )}
                  </button>
                </div>
              </div>
            </CustomModal>

            {/* View Profile Modal */}
            <CustomModal
              isOpen={showViewProfile}
              onClose={() => setShowViewProfile(false)}
              trigger={false}
              title="User Profile"
              className="md:max-w-[70%]"
            >
              <ViewProfile userId={user.id} />
            </CustomModal>
          </>
        );
      },
    },
  ];

  return columns;
};
