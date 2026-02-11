// src/components/app/profile/PostCard.tsx

import type { Post } from "@/api/profile/fetch-user-content";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  CheckCircle2,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  ThumbsUp,
} from "lucide-react";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="p-2 md:p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1.5 md:mb-2">
        <div className="flex gap-1.5 md:gap-2">
          <img
            src={
              post.user.profile_picture ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.username}`
            }
            alt={post.user.fullname}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-0.5 md:gap-1">
              <span className="font-semibold text-[11px] md:text-xs">
                {post.user.fullname}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs text-gray-500">
              <span>@{post.user.username}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-0.5">
          <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-1.5 md:mb-2">
        {post.body && (
          <p className="text-xs md:text-sm text-gray-700 leading-snug mb-1.5 md:mb-2">
            {post.body.length > 150 ? (
              <>
                {post.body.substring(0, 150)}...
                <button className="text-blue-600 hover:text-blue-700 ml-1 font-medium text-[10px] md:text-xs">
                  more
                </button>
              </>
            ) : (
              post.body
            )}
          </p>
        )}

        {/* Quoted Post */}
        {post.quoted_post_detail && (
          <div className="border-l-2 border-blue-500 bg-gray-50 p-1.5 md:p-2 rounded mt-1.5 md:mt-2">
            <div className="flex items-center gap-1 md:gap-1.5 mb-0.5 md:mb-1">
              <img
                src={
                  post.quoted_post_detail.user.profile_picture ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.quoted_post_detail.user.username}`
                }
                alt={post.quoted_post_detail.user.fullname}
                className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full object-cover"
              />
              <span className="text-[10px] md:text-xs font-medium text-gray-900">
                {post.quoted_post_detail.user.fullname}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500">
                @{post.quoted_post_detail.user.username}
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-gray-600 leading-snug line-clamp-2">
              {post.quoted_post_detail.body}
            </p>
          </div>
        )}
      </div>

      {/* Media Grid - Compact */}
      {post.media && post.media.length > 0 && (
        <div
          className={`grid gap-1 md:gap-1.5 mb-1.5 md:mb-2 rounded overflow-hidden ${
            post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.media.slice(0, 4).map((media, index) => (
            <div key={media.id} className="relative">
              <img
                src={media.file}
                alt={`Post media ${index + 1}`}
                className="w-full h-28 md:h-32 object-cover rounded"
              />
              {post.media.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
                  <span className="text-white text-base md:text-lg font-bold">
                    +{post.media.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center gap-3 md:gap-4 pt-1.5 md:pt-2 border-t border-gray-200 text-gray-600">
        <button className="flex items-center gap-1 md:gap-1.5 hover:text-blue-600 transition-colors">
          <ThumbsUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span className="text-[10px] md:text-xs font-medium">
            {formatCount(post.like_count)}
          </span>
        </button>
        <button className="flex items-center gap-1 md:gap-1.5 hover:text-blue-600 transition-colors">
          <MessageSquare className="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span className="text-[10px] md:text-xs font-medium">
            {formatCount(post.comments_count)}
          </span>
        </button>
        <button className="flex items-center gap-1 md:gap-1.5 hover:text-blue-600 transition-colors">
          <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span className="text-[10px] md:text-xs font-medium">
            {formatCount(post.share_count)}
          </span>
        </button>
        <button className="ml-auto hover:text-blue-600 transition-colors">
          <Bookmark
            className={`w-3 h-3 md:w-3.5 md:h-3.5 ${post.isBookmarked ? "fill-current text-blue-600" : ""}`}
          />
        </button>
      </div>

      {/* Promoted Badge */}
      {post.is_promoted && (
        <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-gray-200">
          <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-700 border border-green-300">
            📢 Promoted
          </span>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
