// src/api/content/fetch-content.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

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

interface PaginationLinks {
  next: string | null;
  previous: string | null;
}

interface ContentApiResponse {
  links: PaginationLinks;
  total: number;
  limit: number;
  pages: number;
  results: Content[];
}

interface FetchContentParams {
  search?: string | null;
  page?: number;
  limit?: number;
  type?: string | null; // POST, PRODUCT, REVIEW
}

interface UseFetchContentQueryOptions {
  params: FetchContentParams;
  enabled?: boolean;
}

export const useFetchContentQuery = ({
  params,
  enabled = true,
}: UseFetchContentQueryOptions) => {
  // Clean params - remove null/undefined values and capitalize type
  const cleanParams = {
    ...(params.search && { search: params.search }),
    ...(params.type && { type: params.type.toUpperCase() }), // Capitalize type
    page: params.page || 1,
    limit: params.limit || 15,
  };

  return useQuery<ContentApiResponse, Error>({
    queryKey: [
      "content",
      cleanParams.page,
      cleanParams.search,
      cleanParams.limit,
      cleanParams.type,
    ],

    queryFn: async () => {
      const response = await axiosInstance.get<ContentApiResponse>(
        "/admin/content/",
        {
          params: cleanParams,
        },
      );
      return response.data;
    },

    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Export types for use in components
export type {
  Content,
  ContentApiResponse,
  FetchContentParams,
  MediaFile,
  PostContent,
  ProductContent,
  ReviewContent,
};
