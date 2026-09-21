import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { PaginatedResponse, QueryOptions } from "../types";

export type ContentFilter = "POST" | "PRODUCT" | "REVIEW";

interface PostMedia {
  id: string;
  file: string;
}

interface UserBrief {
  id: string;
  username: string;
  fullname: string;
  profile_picture: string;
}

interface QuotedPost {
  id: string;
  user: UserBrief;
  body: string;
  media: PostMedia[];
  created_at: string;
}

interface Post {
  id: string;
  user: UserBrief;
  body: string;
  media: PostMedia[];
  parent_post: string | null;
  quoted_post: string | null;
  quoted_post_detail: QuotedPost | null;
  like_count: number;
  bookmarks_count: number;
  quotes_count: number;
  is_promoted: boolean;
  isLiked: boolean;
  share_count: number;
  isBookmarked: boolean;
  comments_count: number;
  isOwnPost: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductMedia {
  id: number;
  file: string;
  media_type: string;
}

interface Product {
  id: number;
  user: UserBrief;
  name: string;
  description: string;
  price: string;
  category: string;
  location: string;
  media_files: ProductMedia[];
  created_at: string;
  is_promoted: boolean;
  average_rating: number | null;
  ratings_count: number;
}

interface ReviewMedia {
  id: number;
  file: string;
  media_type: string;
}

interface ReviewVendor {
  id: string;
  full_name: string;
  username: string;
}

interface ReviewItem {
  id: number;
  price: number;
}

interface Review {
  id: number;
  user: UserBrief;
  rating: number;
  text: string;
  created_at: string;
  item: ReviewItem;
  vendor: ReviewVendor;
  media_files: ReviewMedia[];
}

export type UserContentApiResponse<T> = PaginatedResponse<T>;

export interface FetchUserContentParams {
  userId: string;
  filter: ContentFilter;
  page?: number;
  limit?: number;
}

export const useFetchUserContentQuery = <T = Post | Product | Review>({
  params,
  enabled = true,
}: QueryOptions & { params: FetchUserContentParams }) => {
  const queryParams = {
    type: params.filter,
    page: params.page || 1,
    limit: params.limit || 10,
  };

  return useQuery<UserContentApiResponse<T>, Error>({
    queryKey: queryKeys.users.content(params.userId, queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserContentApiResponse<T>>(
        ENDPOINTS.users.content(params.userId),
        { params: queryParams },
      );
      return data;
    },
    enabled: enabled && !!params.userId,
    staleTime: 3 * 60 * 1000,
  });
};

export type { Post, Product, Review };
