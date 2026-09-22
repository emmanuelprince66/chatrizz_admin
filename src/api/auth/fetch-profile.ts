import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import { queryKeys } from "../query-keys";

/** Subset of `PersonalUserProfile` the admin UI uses. */
export interface AdminProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  profile_picture: string | null;
}

// Swagger documents a paginated list, but the view describes a single profile; accept both.
type ProfileResponse = AdminProfile | { results: AdminProfile[] };

export const useFetchMyProfileQuery = () =>
  useQuery<AdminProfile | null, Error>({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const { data } = await axiosInstance.get<ProfileResponse>(ENDPOINTS.auth.profile);
      if ("results" in data && Array.isArray(data.results)) {
        return data.results[0] ?? null;
      }
      return data as AdminProfile;
    },
    staleTime: 30 * 60 * 1000,
  });
