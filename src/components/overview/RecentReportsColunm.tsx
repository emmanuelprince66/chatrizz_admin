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
import { Link } from "react-router-dom";

// Define the reportsInfo type based on the provided data structure

export const useReportsRecentColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const reports = row.original;
        return <div className="font-medium">{reports?.reporter?.username}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const reports = row.original;
        return <div className="text-sm">{reports.details}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const getStatusStyles = (status: string) => {
          const statusLower = status.toLowerCase();

          switch (statusLower) {
            case "processing":
              return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
            case "success":
              return "bg-green-100 text-green-700 border-green-200";
            case "pending":
              return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "failed":
            case "error":
              return "bg-red-100 text-red-700 border-red-200";
            case "cancelled":
            case "canceled":
              return "bg-gray-100 text-gray-700 border-gray-200";
            case "approved":
              return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "rejected":
              return "bg-orange-100 text-orange-700 border-orange-200";
            default:
              return "bg-gray-100 text-gray-700 border-gray-200";
          }
        };

        const formatStatus = (status: string) => {
          return status
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        };

        return (
          <div className="flex items-center">
            <span
              className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
          ${getStatusStyles(status)}
        `}
            >
              {formatStatus(status)}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const reports = row.original;
        const [openViewDetails, setOpenViewDetails] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        const openViewDetailsFunc = () => {
          setOpenViewDetails(true);
        };

        const handleDelete = () => {
          // Implement delete logic here, e.g., API call
          console.log("Delete reports:", reports.id);
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
                <Link to={`/reportss/${reports.id}`}>
                  <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-green-50 hover:text-green-600 transition-colors">
                    View
                  </DropdownMenuItem>
                </Link>

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
                data={reports}
              /> */}
            </CustomModal>

            <CustomModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              trigger={false}
              title="Confirm Delete"
            >
              <div className="p-4">
                <p>Are you sure you want to delete this reports?</p>
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
