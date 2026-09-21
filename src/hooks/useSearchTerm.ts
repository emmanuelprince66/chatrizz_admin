import { useMemo } from "react";

const MIN_SEARCH_LENGTH = 3;

/**
 * Normalises a (debounced) search input for the API. Terms shorter than
 * three characters return `null`, which is dropped from the request, so the
 * list stays unfiltered until the term is long enough to be useful.
 */
export const useSearchTerm = (input: string | undefined) =>
  useMemo(() => {
    const trimmed = input?.trim() ?? "";
    return trimmed.length === 0 || trimmed.length >= MIN_SEARCH_LENGTH
      ? trimmed
      : null;
  }, [input]);
