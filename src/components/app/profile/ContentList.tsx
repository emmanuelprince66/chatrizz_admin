// src/components/app/profile/ContentList.tsx
import type { Post, Product, Review } from "@/api/profile/fetch-user-content";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";
interface ContentApiResponse<T> {
  links: {
    next: string | null;
    previous: string | null;
  };
  total: number;
  limit: number;
  pages: number;
  results: T[];
}
interface ContentListProps {
  response: ContentApiResponse<Post | Product | Review> | undefined;
  loading: boolean;
  setPage: (page: number) => void;
  page: number;
  contentType: "Posts" | "Products" | "Reviews";
}
const ContentList = ({
  response,
  loading,
  setPage,
  page,
  contentType,
}: ContentListProps) => {
  const results = response?.results || [];
  const totalPages = response?.pages || 1;
  const total = response?.total || 0;
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-2 md:space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white p-2 md:p-3 rounded-lg border border-gray-200 animate-pulse"
        >
          <div className="flex gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-1 md:space-y-1.5">
              <div className="h-2.5 md:h-3 bg-gray-200 rounded w-24 md:w-28" />
              <div className="h-2 md:h-2.5 bg-gray-200 rounded w-16 md:w-20" />
            </div>
          </div>
          <div className="space-y-1 md:space-y-1.5">
            <div className="h-2 md:h-2.5 bg-gray-200 rounded w-full" />
            <div className="h-2 md:h-2.5 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
  // Empty state
  if (!loading && results.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <div className="text-gray-400 text-4xl md:text-5xl mb-3 md:mb-4">
          {contentType === "Posts"
            ? "📝"
            : contentType === "Products"
              ? "📦"
              : "⭐"}
        </div>
        <p className="text-gray-500 text-xs md:text-sm">
          No {contentType.toLowerCase()} found
        </p>
      </div>
    );
  }
  return (
    <div>
      {/* Content Cards */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
          {contentType === "Posts" &&
            (results as Post[]).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          {contentType === "Products" &&
            (results as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {contentType === "Reviews" &&
            (results as Review[]).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
        </div>
      )}
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-0 pt-2 md:pt-3 border-t border-gray-200">
          <div className="text-[10px] md:text-xs text-gray-600">
            Page {page} of {totalPages} • {total} total
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="h-6 md:h-7 text-[10px] md:text-xs px-2 md:px-3"
            >
              <ChevronLeft className="w-3 h-3 md:w-3.5 md:h-3.5 mr-0.5 md:mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="h-6 md:h-7 text-[10px] md:text-xs px-2 md:px-3"
            >
              Next
              <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5 md:ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContentList;
