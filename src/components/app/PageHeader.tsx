import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned controls such as search, filters or a primary action. */
  actions?: ReactNode;
  className?: string;
}

/** Standard title block used at the top of every page. */
export const PageHeader = ({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between",
      className,
    )}
  >
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
    {actions && (
      <div className="flex w-full flex-wrap items-center gap-3 xl:w-auto xl:shrink-0 xl:flex-nowrap xl:justify-end">
        {actions}
      </div>
    )}
  </div>
);
