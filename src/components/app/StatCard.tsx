import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const CARD_CLASSES =
  "flex h-32 w-full flex-col justify-between rounded-2xl bg-slate-900 p-6";

export interface StatCardProps {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  /** Secondary line under the value, e.g. "↑ 4% from last month". */
  trend?: ReactNode;
  /** Shows the skeleton in place of the card while data loads. */
  loading?: boolean;
  className?: string;
}

export const StatCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn(CARD_CLASSES, className)} aria-busy="true">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg bg-slate-700/60" />
      <Skeleton className="h-4 w-24 bg-slate-700/60" />
    </div>
    <div className="flex flex-col items-end gap-1.5">
      <Skeleton className="h-7 w-20 bg-slate-700/60" />
      <Skeleton className="h-3 w-28 bg-slate-700/60" />
    </div>
  </div>
);

/** Dark metric card used across dashboard pages. */
export const StatCard = ({
  title,
  value,
  icon,
  trend,
  loading = false,
  className,
}: StatCardProps) => {
  if (loading) return <StatCardSkeleton className={className} />;

  return (
    <div className={cn(CARD_CLASSES, className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-lg text-white [&_svg]:h-5 [&_svg]:w-5">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <p className="mt-0.5 text-xs text-emerald-400">{trend}</p>}
      </div>
    </div>
  );
};
