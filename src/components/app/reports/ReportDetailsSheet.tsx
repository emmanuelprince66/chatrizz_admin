import {
  useFetchPostDetailQuery,
  useFetchProductDetailQuery,
  type PostDetail,
  type ProductDetail,
} from "@/api/content/fetch-content-detail";
import type { Report } from "@/api/reports/fetch-reports";
import {
  ContentCard,
  ContentCardSkeleton,
  DetailList,
  DetailRow,
  DetailsSheet,
  MediaGrid,
  MetaChip,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_PRIMARY_BUTTON,
  PANEL_DATE_FORMAT,
  PANEL_WARNING_BUTTON,
  PanelActionRow,
  PanelEmptyState,
  PanelSection,
  PersonRow,
  StatGrid,
  StatTile,
} from "@/components/app/details-panel";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/util/format-date";
import {
  Bookmark,
  CheckCircle2,
  Heart,
  MapPin,
  MessageCircle,
  Repeat2,
  Share2,
  Star,
  Tag,
  Trash2,
  UserX,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  formatContentType,
  getRemovableContentKind,
  ReasonBadge,
  ReportStatusBadge,
} from "./report-meta";

export interface SuspendTarget {
  id: string;
  label: string;
}

interface ReportDetailsSheetProps {
  report: Report;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: () => void;
  onRemoveContent: () => void;
  onSuspendAuthor: (author: SuspendTarget) => void;
}

const PostPreview = ({ post }: { post: PostDetail }) => (
  <ContentCard>
    <PersonRow
      person={{
        id: post.user.id,
        name: post.user.fullname,
        username: post.user.username,
        avatar: post.user.profile_picture,
      }}
    />
    {post.body ? (
      <p className="text-sm leading-6 whitespace-pre-wrap text-gray-800">{post.body}</p>
    ) : (
      <p className="text-sm text-gray-400 italic">No text in this post.</p>
    )}
    <MediaGrid media={post.media} />
    {post.quoted_post_detail && (
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <p className="text-xs text-gray-500">
          Quoting @{post.quoted_post_detail.user.username ?? "unknown"}
        </p>
        <p className="mt-1 line-clamp-3 text-sm text-gray-700">
          {post.quoted_post_detail.body}
        </p>
      </div>
    )}
    <StatGrid>
      <StatTile icon={Heart} label="Likes" value={post.like_count} />
      <StatTile icon={MessageCircle} label="Comments" value={post.comments_count} />
      <StatTile icon={Share2} label="Shares" value={post.share_count} />
      <StatTile icon={Repeat2} label="Quotes" value={post.quotes_count} />
      <StatTile icon={Bookmark} label="Saves" value={post.bookmarks_count} />
    </StatGrid>
    <p className="text-xs text-gray-400">
      Posted {formatDate(post.created_at, PANEL_DATE_FORMAT)}
    </p>
  </ContentCard>
);

const ProductPreview = ({ product }: { product: ProductDetail }) => (
  <ContentCard>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-semibold text-gray-900">{product.name}</p>
        <p className="text-xs text-gray-500">Seller: {product.user}</p>
      </div>
      <p className="shrink-0 font-semibold text-primary">
        ₦{Number(product.price).toLocaleString()}
      </p>
    </div>
    <MediaGrid media={product.media_files} />
    <p className="text-sm leading-6 whitespace-pre-wrap text-gray-700">
      {product.description || "No description provided."}
    </p>
    <div className="flex flex-wrap gap-2">
      <MetaChip icon={Tag}>{formatContentType(product.category.toLowerCase())}</MetaChip>
      {product.location && <MetaChip icon={MapPin}>{product.location}</MetaChip>}
      <MetaChip icon={Star}>
        {product.average_rating ?? "No"} rating · {product.ratings_count} reviews
      </MetaChip>
    </div>
    <p className="text-xs text-gray-400">
      Listed {formatDate(product.created_at, PANEL_DATE_FORMAT)}
    </p>
  </ContentCard>
);

export const ReportDetailsSheet = ({
  report,
  open,
  onOpenChange,
  onResolve,
  onRemoveContent,
  onSuspendAuthor,
}: ReportDetailsSheetProps) => {
  const kind = getRemovableContentKind(report.content_type);
  const postQuery = useFetchPostDetailQuery(report.target_id, {
    enabled: open && kind === "post",
  });
  const productQuery = useFetchProductDetailQuery(report.target_id, {
    enabled: open && kind === "product",
  });

  const isResolved = report.status === "RESOLVED";
  const author = postQuery.data?.user;
  const activeQuery =
    kind === "post" ? postQuery : kind === "product" ? productQuery : null;
  const isContentAvailable = !!activeQuery?.data;

  const renderContent = () => {
    if (!activeQuery) {
      return (
        <PanelEmptyState
          title="Preview not available"
          description={`${formatContentType(report.content_type)} content can't be previewed here yet.`}
        />
      );
    }
    if (activeQuery.isLoading) return <ContentCardSkeleton />;
    if (postQuery.data && kind === "post") return <PostPreview post={postQuery.data} />;
    if (productQuery.data && kind === "product") {
      return <ProductPreview product={productQuery.data} />;
    }
    return (
      <PanelEmptyState
        title="Content unavailable"
        description="It may already have been removed by its author or a moderator."
      />
    );
  };

  return (
    <DetailsSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Report details"
      badge={<ReportStatusBadge status={report.status} />}
      description={`Reported ${formatDate(report.created_at, PANEL_DATE_FORMAT)}`}
      footer={
        <>
          <Button
            onClick={onResolve}
            disabled={isResolved}
            className={PANEL_PRIMARY_BUTTON}
          >
            <CheckCircle2 />
            {isResolved ? "Report resolved" : "Resolve report"}
          </Button>
          <PanelActionRow>
            <Button
              variant="outline"
              onClick={onRemoveContent}
              disabled={!kind || (activeQuery !== null && !isContentAvailable)}
              className={PANEL_DANGER_BUTTON}
            >
              <Trash2 />
              Remove content
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                author &&
                onSuspendAuthor({
                  id: author.id,
                  label: author.username ? `@${author.username}` : author.fullname,
                })
              }
              disabled={!author}
              title={author ? undefined : "Author is only known for posts"}
              className={PANEL_WARNING_BUTTON}
            >
              <UserX />
              Suspend author
            </Button>
          </PanelActionRow>
        </>
      }
    >
      <PanelSection title="Report">
        <DetailList>
          <DetailRow label="Reason">
            <ReasonBadge reason={report.reason} />
          </DetailRow>
          <DetailRow label="Content type">
            {formatContentType(report.content_type)}
          </DetailRow>
          <DetailRow label="Reported by">
            {report.reporter ? (
              <Link
                to={`/users/${report.reporter.id}`}
                className="text-primary hover:underline"
              >
                @{report.reporter.username}
              </Link>
            ) : (
              "Unknown"
            )}
          </DetailRow>
          <DetailRow label="Times reported">
            {Math.max(report.count, 1).toLocaleString()}
          </DetailRow>
        </DetailList>
        <NoteBlock label="Reporter's note">
          {report.details?.trim() || "No additional details provided."}
        </NoteBlock>
      </PanelSection>

      <PanelSection title="Reported content">{renderContent()}</PanelSection>
    </DetailsSheet>
  );
};
