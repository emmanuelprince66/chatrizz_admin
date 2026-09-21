import { useDeleteReviewMutation } from "@/api/content/delete-content";
import { type ReviewContent } from "@/api/content/fetch-content";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import {
  DetailList,
  DetailRow,
  DetailsSheet,
  MediaGrid,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_DATE_FORMAT,
  PanelSection,
  PersonRow,
  RatingStars,
} from "@/components/app/details-panel";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/util/format-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Image as ImageIcon,
  MoreHorizontal,
  Star,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const ReviewActions = ({ review }: { review: ReviewContent }) => {
  const [showViewReview, setShowViewReview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteReviewMutation();

  const handleDelete = () => {
    deleteMutation.mutate(review.id, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
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

      <DetailsSheet
        open={showViewReview}
        onOpenChange={setShowViewReview}
        title="Review details"
        badge={<RatingStars rating={review.rating} />}
        description={`Reviewed ${formatDate(review.created_at, PANEL_DATE_FORMAT)}`}
        footer={
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className={PANEL_DANGER_BUTTON}
          >
            <Trash2 />
            Delete review
          </Button>
        }
      >
        <PanelSection title="Reviewer">
          <PersonRow
            person={{
              id: review.user.id,
              name: review.user.fullname,
              username: review.user.username,
              avatar: review.user.profile_picture,
            }}
          />
        </PanelSection>

        <PanelSection title="Review">
          <NoteBlock label="Review text">
            {review.text?.trim() || "No review text."}
          </NoteBlock>
          <MediaGrid media={review.media_files} />
        </PanelSection>

        <PanelSection title="Reviewed item">
          <DetailList>
            <DetailRow label="Item ID">
              <span className="font-mono text-xs">#{review.item.id}</span>
            </DetailRow>
            <DetailRow label="Price">₦{review.item.price.toLocaleString()}</DetailRow>
          </DetailList>
        </PanelSection>

        <PanelSection title="Vendor">
          <PersonRow
            person={{
              id: review.vendor.id,
              name: review.vendor.full_name,
              username: review.vendor.username,
            }}
          />
        </PanelSection>
      </DetailsSheet>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this review?"
        notice={{ text: "This action cannot be undone." }}
        confirmLabel="Delete Review"
        pendingLabel="Deleting..."
        confirmIcon={Trash2}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export const useReviewsColumns = () => {
  return useMemo<ColumnDef<ReviewContent>[]>(
    () => [
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
              {/* <img
              src={review.user.profile_picture}
              alt={review.user.username}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            /> */}
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
        cell: () => {
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
        cell: ({ row }) => <ReviewActions review={row.original} />,
      },
    ],
    [],
  );
};
