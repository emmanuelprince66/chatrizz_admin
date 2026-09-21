import { useSyncExternalStore } from "react";

/** Tracks a CSS media query, e.g. `useMediaQuery("(min-width: 640px)")`. */
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
  );
