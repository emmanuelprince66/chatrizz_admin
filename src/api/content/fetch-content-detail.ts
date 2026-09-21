import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import type { ProductCategory } from "../marketplace/fetch-marketplace";
import { queryKeys } from "../query-keys";
import type { QueryOptions } from "../types";

export interface ContentAuthor {
  id: string;
  username: string | null;
  fullname: string;
  profile_picture: string | null;
}

export interface ContentMedia {
  id: string | number;
  file: string;
  media_type?: "image" | "video";
}

/** GET /admin/post/{id}/ (SinglePost). */
export interface PostDetail {
  id: string;
  user: ContentAuthor;
  body: string | null;
  media: ContentMedia[] | null;
  like_count: number;
  comments_count: number;
  bookmarks_count: number;
  quotes_count: number;
  share_count: number;
  is_promoted: boolean;
  created_at: string;
  quoted_post_detail: {
    id: string;
    user: ContentAuthor;
    body: string | null;
    created_at: string;
  } | null;
}

/** GET /admin/product/{id}/ (SingleProduct). */
export interface ProductDetail {
  id: number;
  user: string;
  name: string;
  description: string | null;
  price: string;
  category: ProductCategory;
  location: string;
  media_files: ContentMedia[];
  created_at: string;
  is_active: boolean;
  status: "APPROVED" | "REJECTED";
  average_rating: string | number | null;
  ratings_count: string | number;
}

export const useFetchPostDetailQuery = (
  id: string,
  { enabled = true }: QueryOptions = {},
) =>
  useQuery<PostDetail, Error>({
    queryKey: queryKeys.content.detail("post", id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<PostDetail>(
        ENDPOINTS.content.postDetail(id),
      );
      return data;
    },
    enabled: enabled && !!id,
  });

export const useFetchProductDetailQuery = (
  id: string,
  { enabled = true }: QueryOptions = {},
) =>
  useQuery<ProductDetail, Error>({
    queryKey: queryKeys.content.detail("product", id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProductDetail>(
        ENDPOINTS.content.productDetail(id),
      );
      return data;
    },
    enabled: enabled && !!id,
  });
