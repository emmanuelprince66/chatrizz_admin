import { cn } from "@/lib/utils";

interface FilterPillsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Pill-shaped single-select filter, used for tab-like list filters. */
export const FilterPills = <T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) => (
  <div className={cn("flex flex-wrap gap-2", className)}>
    {options.map((option) => {
      const isActive = option === value;
      return (
        <button
          key={option}
          type="button"
          aria-pressed={isActive}
          onClick={() => onChange(option)}
          className={cn(
            "h-9 min-w-[88px] cursor-pointer rounded-full px-4 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-[#EEF0F1] text-gray-700 hover:bg-gray-200",
          )}
        >
          {option}
        </button>
      );
    })}
  </div>
);
