// src/components/app/profile/ProductCard.tsx

import type { Product } from "@/api/profile/fetch-user-content";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin, MoreVertical, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="p-2 md:p-3 hover:shadow-md transition-shadow">
      <div className="flex gap-2 md:gap-3">
        {/* Product Image - Smaller */}
        <div className="flex-shrink-0">
          {product.media_files && product.media_files.length > 0 ? (
            <div className="relative">
              <img
                src={product.media_files[0].file}
                alt={product.name}
                className="w-14 h-14 md:w-16 md:h-16 object-cover rounded"
              />
              {product.media_files.length > 1 && (
                <div className="absolute bottom-0.5 right-0.5 bg-black bg-opacity-70 text-white text-[9px] md:text-xs px-0.5 md:px-1 py-0.5 rounded">
                  +{product.media_files.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xl md:text-2xl">📦</span>
            </div>
          )}
        </div>

        {/* Product Info - Compact */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 md:gap-2 mb-0.5 md:mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs md:text-sm text-gray-900 truncate">
                {product.name}
              </h3>
              <p className="text-[10px] md:text-xs text-gray-600 line-clamp-1 mt-0.5">
                {product.description}
              </p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-0.5 flex-shrink-0">
              <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Price and Category */}
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
            <span className="text-sm md:text-base font-bold text-blue-600">
              ₦{parseFloat(product.price).toLocaleString()}
            </span>
            <Badge
              variant="outline"
              className="text-[9px] md:text-xs px-1 md:px-1.5 py-0"
            >
              {product.category}
            </Badge>
          </div>

          {/* Rating and Location - Compact */}
          <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-600 mb-1 md:mb-1.5">
            {product.average_rating ? (
              <div className="flex items-center gap-0.5 md:gap-1">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-[10px] md:text-xs">
                  {product.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-400 text-[9px] md:text-xs">
                  ({product.ratings_count})
                </span>
              </div>
            ) : (
              <span className="text-gray-400 text-[10px] md:text-xs">
                No ratings
              </span>
            )}

            {product.location && (
              <>
                <span className="text-gray-300 hidden md:inline">•</span>
                <div className="flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="text-[10px] md:text-xs truncate max-w-[80px] md:max-w-none">
                    {product.location}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Seller Info - Compact */}
          <div className="flex items-center gap-1 md:gap-1.5 pt-1 md:pt-1.5 border-t border-gray-200">
            <img
              src={
                product.user.profile_picture ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.user.username}`
              }
              alt={product.user.fullname}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full object-cover"
            />
            <span className="text-[10px] md:text-xs text-gray-600 truncate">
              {product.user.fullname}
            </span>
            {product.is_promoted && (
              <Badge className="ml-auto bg-green-100 text-green-700 border-green-300 text-[9px] md:text-xs px-1 md:px-1.5 py-0">
                Promoted
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
