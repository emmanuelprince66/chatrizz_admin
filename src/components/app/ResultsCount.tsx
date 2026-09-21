import { Spinner } from "@/components/ui/spinner";

interface ResultsCountProps {
  loading: boolean;
  shown: number;
  total: number;
  /** Plural noun for the items, e.g. "users". */
  label: string;
}

/** "Showing X of Y items" line shown above list tables. */
export const ResultsCount = ({
  loading,
  shown,
  total,
  label,
}: ResultsCountProps) => (
  <p className="flex items-center gap-2 text-sm text-gray-500" aria-live="polite">
    {loading ? (
      <>
        <Spinner size="sm" color="text-primary" />
        Loading {label}...
      </>
    ) : (
      <>
        Showing{" "}
        <span className="font-medium text-gray-900">{shown}</span> of{" "}
        <span className="font-medium text-gray-900">
          {total.toLocaleString()}
        </span>{" "}
        {label}
      </>
    )}
  </p>
);
