import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

// Define the GroupInfo type based on the provided data structure
interface GroupInfo {
  id: string;
  name: string;
  description: string;
  members: number;
}

export const useGroupsColumns = () => {
  const columns: ColumnDef<GroupInfo>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const group = row.original;
        return <div className="font-medium">{group.name}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const group = row.original;
        return <div className="text-sm">{group.description}</div>;
      },
    },
    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row }) => {
        const group = row.original;
        return <div className="text-sm">{group.members}</div>;
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const group = row.original;
        const [openViewDetails, setOpenViewDetails] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        // const openViewDetailsFunc = () => {
        //   setOpenViewDetails(true);
        // };

        const handleDelete = () => {
          // Implement delete logic here, e.g., API call
          console.log("Delete group:", group.id);
          setShowDeleteConfirm(false);
        };

        const confirmDelete = () => {
          setShowDeleteConfirm(true);
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-200 shadow-lg min-w-[180px]"
              >
                <a href={`/groups/${group.id}`}>
                  <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-green-50 hover:text-green-600 transition-colors">
                    View
                  </DropdownMenuItem>
                </a>

                <DropdownMenuItem
                  onClick={confirmDelete}
                  className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CustomModal
              isOpen={openViewDetails}
              onClose={() => setOpenViewDetails(false)}
              trigger={false}
              title="View Details"
            >
              <></>
              {/* <ViewDetails
                closeModal={() => setOpenViewDetails(false)}
                data={group}
              /> */}
            </CustomModal>

            <CustomModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              trigger={false}
              title="Confirm Delete"
            >
              <div className="p-4">
                <p>Are you sure you want to delete this group?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </CustomModal>
          </>
        );
      },
    },
  ];

  return columns;
};
