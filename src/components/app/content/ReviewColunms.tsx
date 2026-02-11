import { type ReviewContent } from "@/api/content/fetch-content";
import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContentHook } from "@/hooks/useContent";
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

export const useReviewsColumns = () => {
  const columns: ColumnDef<ReviewContent>[] = [
    {
      accessorKey: "id",
      header: "Review ID",
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="font-mono text-sm text-gray-700">#{review.id}</div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={review.user.profile_picture}
              alt={review.user.username}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">
                {review.user.username}
              </div>
              <div className="text-xs text-gray-500">
                {review.user.fullname}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "text",
      header: "Review",
      cell: ({ row }) => {
        const review = row.original;
        const hasMedia = review.media_files && review.media_files.length > 0;
        const truncatedText =
          review.text.length > 60
            ? `${review.text.slice(0, 60)}...`
            : review.text;

        return (
          <div className="max-w-md">
            <p
              className="text-sm text-gray-700 line-clamp-2"
              title={review.text}
            >
              {truncatedText || (
                <span className="text-gray-400 italic">No review text</span>
              )}
            </p>
            {hasMedia && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <ImageIcon className="h-3 w-3" />
                <span>{review.media_files.length} media file(s)</span>
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
        const review = row.original;

        return (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-1">
              {review.rating}/5
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "item",
      header: "Item",
      cell: ({ row }) => {
        const review = row.original;

        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              Item #{review.item.id}
            </div>
            <div className="text-xs text-gray-500">
              ₦{review.item.price.toLocaleString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => {
        const review = row.original;

        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {review.vendor.username}
            </div>
            <div className="text-xs text-gray-500">
              {review.vendor.full_name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Posted On",
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className="text-sm text-gray-600">
            {moment(review.created_at).format("DD MMM, YYYY")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const review = row.original;
        const isActive = true;

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
        const review = row.original;
        const [showViewReview, setShowViewReview] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);

        const { handleDeleteReview } = useContentHook({});

        const handleSuccessDelete = () => {
          setIsDeleting(false);
          setShowDeleteConfirm(false);
        };

        const handleDelete = () => {
          setIsDeleting(true);
          handleDeleteReview(review.id, handleSuccessDelete);
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border shadow-lg min-w-[160px]"
              >
                <DropdownMenuItem
                  onClick={() => setShowViewReview(true)}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Modal */}
            <CustomModal
              isOpen={showViewReview}
              onClose={() => setShowViewReview(false)}
              trigger={false}
              title="Review Details"
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <img
                    src={review.user.profile_picture}
                    alt={review.user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{review.user.fullname}</div>
                    <div className="text-sm text-gray-500">
                      @{review.user.username}
                    </div>
                  </div>
                </div>

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
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    Review:
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {review.text || (
                      <span className="text-gray-400 italic">
                        No review text
                      </span>
                    )}
                  </p>
                </div>

                {review.media_files && review.media_files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      Media ({review.media_files.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {review.media_files.map((media) => (
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

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Item ID
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      #{review.item.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Price
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₦{review.item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Vendor
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {review.vendor.full_name} (@{review.vendor.username})
                    </p>
                  </div>
                </div>
              </div>
            </CustomModal>

            {/* Delete Modal */}
            <CustomModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              trigger={false}
              title="Confirm Delete"
            >
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this review?
                </p>
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <p className="text-xs text-red-700">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Review"}
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
