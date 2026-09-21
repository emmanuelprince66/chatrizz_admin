import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ExternalLink, FileQuestion, Star, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const PANEL_DATE_FORMAT = "DD MMM YYYY, h:mm A";

interface DetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Status pill shown next to the title. */
  badge?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Actions pinned to the bottom of the panel. */
  footer?: ReactNode;
}

/** Right-hand detail panel: fixed header, scrolling body, pinned action footer. */
export const DetailsSheet = ({
  open,
  onOpenChange,
  title,
  badge,
  description,
  children,
  footer,
}: DetailsSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      {...(description ? {} : { "aria-describedby": undefined })}
      className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-lg"
    >
      <SheetHeader className="border-b border-gray-100 px-6 py-5 pr-12">
        <div className="flex flex-wrap items-center gap-3">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          {badge}
        </div>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">{children}</div>

      {footer && (
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-6 py-5">
          {footer}
        </div>
      )}
    </SheetContent>
  </Sheet>
);

export const PanelSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      {title}
    </h3>
    {children}
  </section>
);

/** Bordered list of label/value rows. */
export const DetailList = ({ children }: { children: ReactNode }) => (
  <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 px-4">
    {children}
  </div>
);

export const DetailRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
    <span className="shrink-0 text-gray-500">{label}</span>
    <span className="min-w-0 text-right font-medium break-words text-gray-900">
      {children}
    </span>
  </div>
);

/** Grey callout for free text such as a note or description. */
export const NoteBlock = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-xs font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-sm leading-6 whitespace-pre-wrap text-gray-700">
      {children}
    </div>
  </div>
);

export const StatGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-2">{children}</div>
);

export const StatTile = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
}) => (
  <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
    <Icon className="h-4 w-4 shrink-0 text-gray-400" />
    <span className="text-sm font-semibold text-gray-900">
      {typeof value === "number" ? value.toLocaleString() : value}
    </span>
    <span className="truncate text-xs text-gray-500">{label}</span>
  </div>
);

export interface PanelMedia {
  id: string | number;
  file: string;
  media_type?: string;
}

export const MediaGrid = ({ media }: { media: PanelMedia[] | null | undefined }) => {
  const items = Array.isArray(media) ? media : [];
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) =>
        item.media_type === "video" ? (
          <video
            key={item.id}
            src={item.file}
            controls
            className="aspect-square w-full rounded-lg bg-black object-cover"
          />
        ) : (
          <a key={item.id} href={item.file} target="_blank" rel="noreferrer">
            <img
              src={item.file}
              alt=""
              className="aspect-square w-full rounded-lg border border-gray-100 object-cover transition-opacity hover:opacity-90"
            />
          </a>
        ),
      )}
    </div>
  );
};

interface PanelPerson {
  id?: string;
  name?: string | null;
  username?: string | null;
  avatar?: string | null;
  /** Secondary line shown instead of the username, e.g. an email. */
  subtitle?: string | null;
}

/** Avatar, name and handle, with a link to the user's profile when the id is known. */
export const PersonRow = ({ person }: { person: PanelPerson }) => {
  const displayName = person.name || person.username || "Unknown user";
  const subtitle = person.subtitle ?? (person.username ? `@${person.username}` : null);

  return (
    <div className="flex items-center gap-3">
      {person.avatar ? (
        <img src={person.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4FA] text-sm font-semibold text-primary">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
        {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
      </div>
      {person.id && (
        <Link
          to={`/users/${person.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Profile <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
};

export const RatingStars = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <span className="inline-flex items-center gap-1">
    <span className="flex">
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200",
          )}
        />
      ))}
    </span>
    <span className="text-sm font-semibold text-gray-900">
      {rating}/{max}
    </span>
  </span>
);

/** Small icon + text pill for secondary facts (category, location, rating). */
export const MetaChip = ({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
    <Icon className="h-3 w-3" />
    {children}
  </span>
);

/** Bordered card that groups a piece of content inside a section. */
export const ContentCard = ({ children }: { children: ReactNode }) => (
  <div className="space-y-4 rounded-xl border border-gray-100 p-4">{children}</div>
);

export const ContentCardSkeleton = () => (
  <ContentCard>
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-32 w-full" />
  </ContentCard>
);

export const PanelEmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
    <FileQuestion className="h-8 w-8 text-gray-300" />
    <p className="mt-3 text-sm font-medium text-gray-900">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{description}</p>
  </div>
);

/** Pill badge used in panel headers. */
export const PanelBadge = ({
  tone,
  children,
}: {
  tone: "green" | "yellow" | "red" | "gray" | "blue";
  children: ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
      {
        green: "border-green-200 bg-green-50 text-green-700",
        yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
        red: "border-red-200 bg-red-50 text-red-700",
        gray: "border-gray-200 bg-gray-50 text-gray-700",
        blue: "border-blue-200 bg-blue-50 text-blue-700",
      }[tone],
    )}
  >
    {children}
  </span>
);

/** Two footer actions side by side. */
export const PanelActionRow = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
);

/** Footer button styles shared by panels. */
export const PANEL_PRIMARY_BUTTON = "h-11 w-full";
export const PANEL_DANGER_BUTTON =
  "h-11 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700";
export const PANEL_WARNING_BUTTON =
  "h-11 w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700";
export const PANEL_SUCCESS_BUTTON =
  "h-11 w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800";
