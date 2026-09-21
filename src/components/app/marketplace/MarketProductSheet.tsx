import type { MarketplaceProduct } from "@/api/marketplace/fetch-marketplace";
import {
  useProductStatusMutation,
  type ProductDecision,
} from "@/api/marketplace/product-actions";
import {
  DetailList,
  DetailRow,
  DetailsSheet,
  MediaGrid,
  MetaChip,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_DATE_FORMAT,
  PANEL_SUCCESS_BUTTON,
  PanelActionRow,
  PanelBadge,
  PanelEmptyState,
  PanelSection,
  RatingStars,
} from "@/components/app/details-panel";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/util/format-date";
import { Check, MapPin, Tag, X } from "lucide-react";

const formatCategory = (category: string) =>
  category.charAt(0) + category.slice(1).toLowerCase();

interface MarketProductSheetProps {
  product: MarketplaceProduct | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MarketProductSheet = ({
  product,
  open,
  onOpenChange,
}: MarketProductSheetProps) => {
  const { mutate, isPending, variables } = useProductStatusMutation();

  if (!product) return null;

  const isApproved = product.status === "APPROVED";
  const rating = Number(product.average_rating);
  const pendingAction = isPending ? variables?.action : undefined;

  const decide = (action: ProductDecision) => mutate({ id: product.id, action });

  return (
    <DetailsSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Product details"
      badge={
        <PanelBadge tone={isApproved ? "green" : "red"}>
          {isApproved ? "Approved" : "Rejected"}
        </PanelBadge>
      }
      description={`Listed ${formatDate(product.created_at, PANEL_DATE_FORMAT)}`}
      footer={
        <PanelActionRow>
          <Button
            variant="outline"
            onClick={() => decide("approve")}
            disabled={isPending || isApproved}
            className={PANEL_SUCCESS_BUTTON}
          >
            {pendingAction === "approve" ? <Spinner size="sm" /> : <Check />}
            {isApproved ? "Approved" : "Approve"}
          </Button>
          <Button
            variant="outline"
            onClick={() => decide("reject")}
            disabled={isPending || !isApproved}
            className={PANEL_DANGER_BUTTON}
          >
            {pendingAction === "reject" ? <Spinner size="sm" /> : <X />}
            {isApproved ? "Reject" : "Rejected"}
          </Button>
        </PanelActionRow>
      }
    >
      <PanelSection title="Product">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-gray-900">{product.name}</p>
          <p className="shrink-0 text-lg font-semibold text-primary">
            ₦{Number(product.price).toLocaleString()}
          </p>
        </div>
        {product.media_files.length > 0 ? (
          <MediaGrid media={product.media_files} />
        ) : (
          <PanelEmptyState
            title="No photos"
            description="The seller didn't upload any media for this product."
          />
        )}
        <NoteBlock label="Description">
          {product.description?.trim() || "No description provided."}
        </NoteBlock>
        <div className="flex flex-wrap gap-2">
          <MetaChip icon={Tag}>{formatCategory(product.category)}</MetaChip>
          {product.location && <MetaChip icon={MapPin}>{product.location}</MetaChip>}
        </div>
      </PanelSection>

      <PanelSection title="Listing">
        <DetailList>
          <DetailRow label="Seller">{product.user}</DetailRow>
          <DetailRow label="Rating">
            {rating > 0 ? <RatingStars rating={Number(rating.toFixed(1))} /> : "No ratings yet"}
          </DetailRow>
          <DetailRow label="Reviews">
            {Number(product.ratings_count || 0).toLocaleString()}
          </DetailRow>
          <DetailRow label="Promoted">{product.is_promoted ? "Yes" : "No"}</DetailRow>
          <DetailRow label="Visible to buyers">
            {product.is_active ? "Yes" : "No"}
          </DetailRow>
          <DetailRow label="Product ID">
            <span className="font-mono text-xs">#{product.id}</span>
          </DetailRow>
        </DetailList>
      </PanelSection>
    </DetailsSheet>
  );
};
