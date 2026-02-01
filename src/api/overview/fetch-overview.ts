import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

export const useFetchOverviewQuery = ({
  params,
}: {
  params: {
    search?: string | null;
    page: number;
    limit: number;
    start_date?: string;
    end_date?: string;
  };
}) => {
  const {
    data: OverviewData,
    isLoading: OverviewDataLoading,
    refetch: OverviewDataRefetch,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "overview",
      params.page,
      params.search,
      params.start_date,
      params.end_date,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<any>("admin/overview/", {
        params,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
  });

  return {
    data: OverviewData,
    isLoading: OverviewDataLoading,
    refetch: OverviewDataRefetch,
    isError,
    error,
  };
};
