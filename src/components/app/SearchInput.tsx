import * as React from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps extends React.ComponentProps<"input"> {
  /** Applied to the wrapper, so width classes size the whole control. */
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  clearButtonClassName?: string;
  value: string | number;
  onValueChange: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      inputClassName,
      iconClassName,
      clearButtonClassName,
      value,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const handleClear = () => {
      onValueChange("");
    };

    return (
      <div className={cn("relative w-full", className)}>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "flex h-10 w-full rounded-full border-0 bg-[#EDF0F1] px-10 text-sm transition-shadow outline-none",
            "focus:ring-2 focus:ring-ring [&::-webkit-search-cancel-button]:appearance-none",
            "placeholder:text-muted-foreground disabled:opacity-50",
            inputClassName,
          )}
          onChange={(e) => onValueChange(e.target.value)}
          {...props}
        />
        <Search
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
            iconClassName,
          )}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className={cn(
              "absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-600",
              clearButtonClassName,
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
