import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { ListParams, PaginatedResponse, QueryOptions } from "../types";
import { compactParams } from "../utils";

// Common User interface
interface User {
  id: string;
  username: string;
  fullname: string;
  profile_picture: string;
}

// POST interfaces
interface Media {
  id: string;
  file: string;
}

interface QuotedPost {
  id: string;
  user: User;
  body: string;
  media: Media[];
  created_at: string;
}

interface PostContent {
  id: string;
  user: User;
  body: string;
  media: Media[];
  parent_post: string | null;
  quoted_post: string | null;
  quoted_post_detail: QuotedPost | null;
  like_count: number;
  bookmarks_count: number;
  quotes_count: number;
  is_promoted: boolean;
  share_count: number;
  comments_count: number;
  isOwnPost: boolean;
  created_at: string;
  updated_at: string;
}

// PRODUCT interfaces
interface MediaFile {
  id: number;
  file: string;
  media_type: string;
}

interface ProductContent {
  id: number;
  user: User;
  name: string;
  description: string;
  price: string;
  category: string;
  location: string;
  media_files: MediaFile[];
  created_at: string;
  is_promoted: boolean;
  average_rating: number | null;
  ratings_count: number;
}

// REVIEW interfaces
interface Vendor {
  id: string;
  full_name: string;
  username: string;
}

interface Item {
  id: number;
  price: number;
}

interface ReviewContent {
  id: number;
  user: User;
  vendor: Vendor;
  item: Item;
  text: string;
  rating: number;
  media_files: MediaFile[];
  created_at: string;
}

// Union type for all content types
type Content = PostContent | ProductContent | ReviewContent;

export type ContentApiResponse = PaginatedResponse<Content>;

export interface FetchContentParams extends ListParams {
  /** POST, PRODUCT or REVIEW (case-insensitive). */
  type?: string | null;
}

export const useFetchContentQuery = ({
  params,
  enabled = true,
}: QueryOptions & { params: FetchContentParams }) => {
  const queryParams = compactParams({
    search: params.search,
    type: params.type?.toUpperCase(),
    page: params.page || 1,
    limit: params.limit || 15,
  });

  return useQuery<ContentApiResponse, Error>({
    queryKey: queryKeys.content.list(queryParams),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ContentApiResponse>(
        ENDPOINTS.content.list,
        { params: queryParams },
      );
      return data;
    },
    enabled,
  });
};

export type { Content, MediaFile, PostContent, ProductContent, ReviewContent };
