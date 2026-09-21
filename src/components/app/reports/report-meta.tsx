/* eslint-disable react-refresh/only-export-components -- small shared badge components plus their helpers */
import type { ReportReason, ReportStatus } from "@/api/reports/fetch-reports";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Flame,
  Image,
  Info,
  MessageSquare,
  MoreHorizontal,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

const REASON_CONFIG: Record<
  ReportReason,
  { label: string; icon: LucideIcon; className: string }
> = {
  spam: {
    label: "Spam",
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-700",
  },
  harassment: {
    label: "Harassment",
    icon: MessageSquare,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  hate: {
    label: "Hate Speech",
    icon: Flame,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  violence: {
    label: "Violence",
    icon: ShieldAlert,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  misinformation: {
    label: "Misinformation",
    icon: Info,
    className: "border-purple-200 bg-purple-50 text-purple-700",
  },
  nudity: {
    label: "Nudity",
    icon: Image,
    className: "border-pink-200 bg-pink-50 text-pink-700",
  },
  other: {
    label: "Other",
    icon: MoreHorizontal,
    className: "border-gray-200 bg-gray-50 text-gray-700",
  },
};

const STATUS_CONFIG: Record<ReportStatus, { label: string; className: string }> =
  {
    PROCESSING: {
      label: "Processing",
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    RESOLVED: {
      label: "Resolved",
      className: "border-green-200 bg-green-50 text-green-700",
    },
  };

const BADGE_CLASSES =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium";

export const ReasonBadge = ({ reason }: { reason: ReportReason }) => {
  const config = REASON_CONFIG[reason] ?? REASON_CONFIG.other;
  const Icon = config.icon;
  return (
    <span className={cn(BADGE_CLASSES, config.className)}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

export const ReportStatusBadge = ({ status }: { status: ReportStatus }) => {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "border-gray-200 bg-gray-50 text-gray-700",
  };
  return <span className={cn(BADGE_CLASSES, config.className)}>{config.label}</span>;
};

/** "user_profile" -> "User Profile" */
export const formatContentType = (type: string) =>
  type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export type RemovableContentKind = "post" | "product" | "review";

/** Maps a report's `content_type` to the delete endpoint that can remove it, if any. */
export const getRemovableContentKind = (
  contentType: string,
): RemovableContentKind | null => {
  const type = contentType.toLowerCase();
  if (type.includes("post")) return "post";
  if (type.includes("product")) return "product";
  if (type.includes("review")) return "review";
  return null;
};
