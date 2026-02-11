import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

export const useContentColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Content ID",
      cell: ({ row }) => {
        const content = row.original;
        return (
          <div className="font-mono text-sm text-gray-700">#{content.id}</div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const content = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={content.user.profile_picture}
              alt={content.user.username}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">
                {content.user.username}
              </div>
              <div className="text-xs text-gray-500">
                {content.user.fullname}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "text",
      header: "Content",
      cell: ({ row }) => {
        const content = row.original;
        const hasMedia = content.media_files && content.media_files.length > 0;
        const truncatedText =
          content.text.length > 60
            ? `${content.text.slice(0, 60)}...`
            : content.text;

        return (
          <div className="max-w-md">
            <p
              className="text-sm text-gray-700 line-clamp-2"
              title={content.text}
            >
              {truncatedText || (
                <span className="text-gray-400 italic">No text content</span>
              )}
            </p>
            {hasMedia && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <ImageIcon className="h-3 w-3" />
                <span>{content.media_files.length} media file(s)</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const content = row.original;

        return (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < content.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-1">
              {content.rating}/5
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => {
        const content = row.original;

        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              Item #{content.item.id}
            </div>
            <div className="text-xs text-gray-500">
              ₦{content.item.price.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => {
        const content = row.original;

        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {content.vendor.username}
            </div>
            <div className="text-xs text-gray-500">
              {content.vendor.full_name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Posted On",
      cell: ({ row }) => {
        const content = row.original;
        return (
          <div className="text-sm text-gray-600">
            {moment(content.created_at).format("DD MMM, YYYY")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        console.log("row", row);
        // const content = row.original;
        // You can add actual status logic here if available in your API
        const isActive = true; // Placeholder - replace with actual status logic

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
              isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isActive ? "Active" : "Deleted"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const content = row.original;
        const [showViewContent, setShowViewContent] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);

        const handleViewContent = () => {
          setShowViewContent(true);
        };

        const handleDelete = async () => {
          try {
            setIsDeleting(true);
            // Implement delete content logic here
            // await deleteContentMutation.mutateAsync({ contentId: content.id });

            console.log("Delete content:", content.id);

            toast.success("Content deleted successfully");
            setShowDeleteConfirm(false);
          } catch (error) {
            toast.error("Failed to delete content", {
              description:
                "Please try again or contact support if the issue persists.",
            });
          } finally {
            setIsDeleting(false);
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
                  onClick={handleViewContent}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Content Modal */}
            <CustomModal
              isOpen={showViewContent}
              onClose={() => setShowViewContent(false)}
              trigger={false}
              title="Review Details"
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <img
                    src={content.user.profile_picture}
                    alt={content.user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {content.user.fullname}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{content.user.username}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    Rating:
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < content.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {content.rating}/5
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    Review:
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {content.text || (
                      <span className="text-gray-400 italic">
                        No review text
                      </span>
                    )}
                  </p>
                </div>

                {/* Media */}
                {content.media_files && content.media_files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      Media ({content.media_files.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {content.media_files.map((media: any) => (
                        <img
                          key={media.id}
                          src={media.file}
                          alt="Review media"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Item & Vendor Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Item ID
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      #{content.item.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Price
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₦{content.item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Vendor
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {content.vendor.full_name} (@{content.vendor.username})
                    </p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Posted:</span>{" "}
                    {moment(content.created_at).format("DD MMM YYYY, HH:mm")}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowViewContent(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </CustomModal>

            {/* Delete Confirmation Modal */}
            <CustomModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              trigger={false}
              title="Confirm Delete"
            >
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this review from{" "}
                  <span className="font-semibold text-gray-900">
                    {content.user.username}
                  </span>
                  ?
                </p>

                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-red-800 font-medium">
                        Warning
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        This action cannot be undone. The review will be
                        permanently removed from the platform.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete Review
                      </>
                    )}
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
