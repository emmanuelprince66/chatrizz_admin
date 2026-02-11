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
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";

export const usePostsColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Post ID",
      cell: ({ row }) => {
        const post = row.original;
        const shortId = post.id.slice(0, 8);
        return <div className="font-mono text-sm text-gray-700">{shortId}</div>;
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={post.user.profile_picture}
              alt={post.user.username}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">
                {post.user.username}
              </div>
              <div className="text-xs text-gray-500">{post.user.fullname}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "body",
      header: "Content",
      cell: ({ row }) => {
        const post = row.original;
        const hasMedia = post.media && post.media.length > 0;
        const truncatedBody =
          post.body.length > 60 ? `${post.body.slice(0, 60)}...` : post.body;

        return (
          <div className="max-w-md">
            <p className="text-sm text-gray-700 line-clamp-2" title={post.body}>
              {truncatedBody || (
                <span className="text-gray-400 italic">No text content</span>
              )}
            </p>
            {hasMedia && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <ImageIcon className="h-3 w-3" />
                <span>{post.media.length} media file(s)</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "engagements",
      header: "Engagements",
      cell: ({ row }) => {
        const post = row.original;
        const totalEngagement =
          post.like_count + post.comments_count + post.share_count;

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-pink-600">
                <Heart className="h-3 w-3" />
                {post.like_count}
              </span>
              <span className="flex items-center gap-1 text-blue-600">
                <MessageSquare className="h-3 w-3" />
                {post.comments_count}
              </span>
              <span className="flex items-center gap-1 text-green-600">
                <Share2 className="h-3 w-3" />
                {post.share_count}
              </span>
            </div>
            <div className="text-xs font-medium text-gray-700">
              {totalEngagement} total
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Posted On",
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="text-sm text-gray-600">
            {moment(post.created_at).format("DD MMM, YYYY")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const post = row.original;
        const isActive = true; // You can add logic for this

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
        const post = row.original;
        const [showViewPost, setShowViewPost] = useState(false);
        const [isDeletingPost, setIsDeletingPost] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        const { handleDeletePost, isDeletePostPending } = useContentHook({});

        const handleSuccessDelete = () => {
          setIsDeletingPost(false);
          setShowDeleteConfirm(false);
        };

        const handleDelete = () => {
          setIsDeletingPost(true);
          handleDeletePost(post.id, handleSuccessDelete);
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
                  onClick={() => setShowViewPost(true)}
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
              isOpen={showViewPost}
              onClose={() => setShowViewPost(false)}
              trigger={false}
              title="Post Details"
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <img
                    src={post.user.profile_picture}
                    alt={post.user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{post.user.fullname}</div>
                    <div className="text-sm text-gray-500">
                      @{post.user.username}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">
                    Post Content:
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {post.body}
                  </p>
                </div>

                {post.media && post.media.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      Media ({post.media.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {post.media.map((media: any) => (
                        <img
                          key={media.id}
                          src={media.file}
                          alt="Post media"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Likes</p>
                    <p className="text-lg font-semibold">{post.like_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Comments</p>
                    <p className="text-lg font-semibold">
                      {post.comments_count}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shares</p>
                    <p className="text-lg font-semibold">{post.share_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bookmarks</p>
                    <p className="text-lg font-semibold">
                      {post.bookmarks_count}
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
                  Are you sure you want to delete this post?
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
                    disabled={isDeletePostPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeletePostPending}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeletePostPending ||
                      (isDeletingPost && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ))}
                    {isDeletePostPending || isDeletingPost
                      ? "Deleting..."
                      : "Delete Post"}
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
