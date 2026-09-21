import type { Group } from "@/api/profile/fetch-groups";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const DetailField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <div className="mt-1 text-sm text-gray-700">{children}</div>
  </div>
);

// eslint-disable-next-line react-refresh/only-export-components
const GroupActions = ({ group }: { group: Group }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const groupName = group.name || "Untitled group";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={`Actions for ${groupName}`}
            className="flex h-8 w-8 items-center justify-center rounded-full p-0 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px] bg-white">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            View more
          </DropdownMenuItem>
          <DropdownMenuItem>Block group</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Group details"
      >
        <div className="space-y-4">
          <DetailField label="Name">
            <span className="font-semibold text-gray-900">{groupName}</span>
          </DetailField>
          <DetailField label="Description">
            <span className="leading-6">
              {group.description || "No description provided."}
            </span>
          </DetailField>
          <DetailField label="Members">
            {group.members.toLocaleString()}
          </DetailField>
          <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
            Backend data required for moderation actions
          </span>
        </div>
      </CustomModal>

      {/* No delete-group endpoint exists yet, so confirming only closes the dialog. */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => setShowDeleteConfirm(false)}
        title="Confirm delete"
        message={
          <>
            Are you sure you want to delete <strong>{groupName}</strong>?
          </>
        }
        confirmLabel="Delete"
        confirmIcon={Trash2}
      />
    </>
  );
};

export const useGroupsColumns = () => {
  const columns: ColumnDef<Group>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name || "Untitled group"}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="max-w-[280px] truncate text-sm text-gray-600"
          title={row.original.description ?? undefined}
        >
          {row.original.description || "No description"}
        </div>
      ),
    },
    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.members.toLocaleString()}</div>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <GroupActions group={row.original} />,
    },
  ];

  return columns;
};
