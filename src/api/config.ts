const DEFAULT_API_BASE_URL = "https://api.chatrizz.co/api/v1/";

/** Override per environment with `VITE_API_BASE_URL` (see `.env.example`). */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_TIMEOUT_MS = 30_000;
