// src/api/profile/fetch-user-by-id.ts

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

interface UserDetail {
  id: string;
  full_name: string | null;
  username: string | null;
  gender: string;
  phone: string;
  email: string;
  location: string | null;
  profile_picture: string;
  type: string;
  following_count: number;
  followers_count: number;
  bio: string | null;
  post_count: number;
  follower: boolean;
  messages_count: number;
  following: boolean;
  is_active: boolean;
  is_online: boolean;
  last_seen: string;
  allowed_call: string;
  allowed_message: string;
  business_category: string | null;
  business_description: string | null;
  business_location: string | null;
  organization_url: string | null;
  active_subscription: boolean;
}

interface UseFetchUserByIdQueryOptions {
  userId: string;
  enabled?: boolean;
}

export const useFetchUserByIdQuery = ({
  userId,
  enabled = true,
}: UseFetchUserByIdQueryOptions) => {
  return useQuery<UserDetail, Error>({
    queryKey: ["user-detail", userId],

    queryFn: async () => {
      const response = await axiosInstance.get<UserDetail>(
        `/admin/user/${userId}/`,
      );
      return response.data;
    },

    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export type { UserDetail };
