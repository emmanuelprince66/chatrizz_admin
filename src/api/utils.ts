import { isAxiosError } from "axios";
import type { PaginationLinks } from "./types";

type ParamValue = string | number | boolean | null | undefined;

/** Drops `null`, `undefined` and empty-string values so they are not sent as query params. */
export const compactParams = <T extends Record<string, ParamValue>>(
  params: T,
) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;

const MESSAGE_KEYS = ["message", "detail", "error"] as const;

/** Extracts a human-readable message from an API error, falling back when none is usable. */
export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!isAxiosError(error)) return fallback;
  if (!error.response) {
    return "Network error. Check your connection and try again.";
  }

  const data: unknown = error.response.data;
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  for (const key of MESSAGE_KEYS) {
    if (typeof record[key] === "string" && record[key]) return record[key];
  }

  // Field validation errors, e.g. `{ email: ["Enter a valid email."] }`.
  const fieldError = Object.values(record).find(
    (value): value is string[] =>
      Array.isArray(value) && typeof value[0] === "string",
  );
  return fieldError?.[0] ?? fallback;
};

/**
 * Some endpoints return `results` as an array, others nest it as
 * `results: { data: [...], count, ...metrics }`. This accepts both.
 */
export interface FlexibleListResponse<T, TNested extends object = object> {
  total?: number;
  count?: number;
  pages?: number;
  next?: string | null;
  previous?: string | null;
  links?: PaginationLinks;
  results: T[] | ({ data?: T[]; count?: number; total?: number } & TNested);
}

export const normalizeListResponse = <T, TNested extends object = object>(
  data: FlexibleListResponse<T, TNested>,
) => {
  const nested = Array.isArray(data.results) ? undefined : data.results;
  const results = Array.isArray(data.results)
    ? data.results
    : (data.results.data ?? []);

  return {
    results,
    nested,
    count:
      data.total ?? data.count ?? nested?.total ?? nested?.count ?? results.length,
    totalPages: data.pages ?? (results.length > 0 ? 1 : 0),
    next: data.next ?? data.links?.next ?? null,
    previous: data.previous ?? data.links?.previous ?? null,
  };
};
