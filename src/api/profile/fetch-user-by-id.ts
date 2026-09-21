import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";
import type { QueryOptions } from "../types";

export interface UserDetail {
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

export const useFetchUserByIdQuery = ({
  userId,
  enabled = true,
}: QueryOptions & { userId: string }) =>
  useQuery<UserDetail, Error>({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<UserDetail>(
        ENDPOINTS.users.detail(userId),
      );
      return data;
    },
    enabled: enabled && !!userId,
  });
