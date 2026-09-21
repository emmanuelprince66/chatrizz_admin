import { useDeletePostMutation } from "@/api/content/delete-content";
import type { PostContent } from "@/api/content/fetch-content";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import {
  DetailList,
  DetailRow,
  DetailsSheet,
  MediaGrid,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_DATE_FORMAT,
  PanelBadge,
  PanelSection,
  PersonRow,
  StatGrid,
  StatTile,
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
  Bookmark,
  Eye,
  Heart,
  Image as ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Repeat2,
  Share2,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const PostActions = ({ post }: { post: PostContent }) => {
  const [showViewPost, setShowViewPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeletePostMutation();

  const handleDelete = () => {
    deleteMutation.mutate(post.id, {
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

      <DetailsSheet
        open={showViewPost}
        onOpenChange={setShowViewPost}
        title="Post details"
        badge={post.is_promoted ? <PanelBadge tone="blue">Promoted</PanelBadge> : undefined}
        description={`Posted ${formatDate(post.created_at, PANEL_DATE_FORMAT)}`}
        footer={
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className={PANEL_DANGER_BUTTON}
          >
            <Trash2 />
            Delete post
          </Button>
        }
      >
        <PanelSection title="Author">
          <PersonRow
            person={{
              id: post.user.id,
              name: post.user.fullname,
              username: post.user.username,
              avatar: post.user.profile_picture,
            }}
          />
        </PanelSection>

        <PanelSection title="Content">
          <NoteBlock label="Post text">
            {post.body?.trim() || "No text in this post."}
          </NoteBlock>
          <MediaGrid media={post.media} />
          {post.quoted_post_detail && (
            <NoteBlock
              label={`Quoting @${post.quoted_post_detail.user.username ?? "unknown"}`}
            >
              {post.quoted_post_detail.body}
            </NoteBlock>
          )}
        </PanelSection>

        <PanelSection title="Engagement">
          <StatGrid>
            <StatTile icon={Heart} label="Likes" value={post.like_count} />
            <StatTile icon={MessageSquare} label="Comments" value={post.comments_count} />
            <StatTile icon={Share2} label="Shares" value={post.share_count} />
            <StatTile icon={Repeat2} label="Quotes" value={post.quotes_count} />
            <StatTile icon={Bookmark} label="Saves" value={post.bookmarks_count} />
          </StatGrid>
        </PanelSection>

        <PanelSection title="Details">
          <DetailList>
            <DetailRow label="Post ID">
              <span className="font-mono text-xs">{post.id}</span>
            </DetailRow>
            <DetailRow label="Last updated">
              {formatDate(post.updated_at, PANEL_DATE_FORMAT)}
            </DetailRow>
          </DetailList>
        </PanelSection>
      </DetailsSheet>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this post?"
        notice={{ text: "This action cannot be undone." }}
        confirmLabel="Delete Post"
        pendingLabel="Deleting..."
        confirmIcon={Trash2}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export const usePostsColumns = () => {
  return useMemo<ColumnDef<PostContent>[]>(() => [
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
      cell: () => {
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
      cell: ({ row }) => <PostActions post={row.original} />,
    },
  ], []);
};
