// src/components/app/profile/ReviewCard.tsx
import type { Review } from "@/api/profile/fetch-user-content";
import { Card } from "@/components/ui/card";
import { CheckCircle2, MoreVertical, Star } from "lucide-react";
interface ReviewCardProps {
  review: Review;
}
const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (date: string) => {
    const reviewDate = new Date(date);
    return reviewDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };
  return (
    <Card className="p-2 md:p-3 hover:shadow-md transition-shadow">
      {/* Reviewer Info - Compact */}
      <div className="flex justify-between items-start mb-1.5 md:mb-2">
        <div className="flex gap-1.5 md:gap-2">
          <img
            src={
              review.user.profile_picture ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user.username}`
            }
            alt={review.user.fullname}
            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-0.5 md:gap-1">
              <span className="font-semibold text-[11px] md:text-xs">
                {review.user.fullname}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-500" />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500">
              @{review.user.username}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-0.5">
          <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
      {/* Rating - Compact */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
        <div className="flex items-center gap-0.5">
          {renderStars(review.rating)}
        </div>
        <span className="text-[11px] md:text-xs font-semibold text-gray-900">
          {review.rating}.0
        </span>
        <span className="text-[10px] md:text-xs text-gray-400">
          • {formatDate(review.created_at)}
        </span>
      </div>
      {/* Review Text - Compact */}
      <p className="text-xs md:text-sm text-gray-700 leading-snug mb-1.5 md:mb-2">
        {review.text}
      </p>
      {/* Product and Vendor Info - Compact */}
      <div className="pt-1.5 md:pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-[10px] md:text-xs">
          <div className="flex items-center gap-0.5 md:gap-1">
            <span className="text-gray-500">Product:</span>
            <span className="font-medium text-gray-900">
              ₦{review.item.price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            <span className="text-gray-500">Vendor:</span>
            <span className="font-medium text-gray-900 truncate max-w-[100px] md:max-w-[120px]">
              {review.vendor.full_name}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default ReviewCard;
