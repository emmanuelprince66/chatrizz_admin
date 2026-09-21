import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const MAX_QUERY_RETRIES = 2;

/** Client errors (4xx) will fail the same way again, so only retry network and server errors. */
const shouldRetry = (failureCount: number, error: unknown) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status && status >= 400 && status < 500) return false;
  return failureCount < MAX_QUERY_RETRIES;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    },
    mutations: {
      retry: false,
    },
  },
});
