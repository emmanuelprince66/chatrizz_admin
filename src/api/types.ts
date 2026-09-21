export interface PaginationLinks {
  next: string | null;
  previous: string | null;
}

/** Standard paginated list envelope returned by most admin endpoints. */
export interface PaginatedResponse<T> {
  links: PaginationLinks;
  total: number;
  limit: number;
  pages: number;
  results: T[];
}

export interface ListParams {
  search?: string | null;
  page?: number;
  limit?: number;
}

export interface QueryOptions {
  enabled?: boolean;
}

export interface MessageResponse {
  message?: string;
  success?: boolean;
}
