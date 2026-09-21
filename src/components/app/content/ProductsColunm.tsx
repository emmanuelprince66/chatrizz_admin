import { useDeleteProductMutation } from "@/api/content/delete-content";
import { type ProductContent } from "@/api/content/fetch-content";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import {
  DetailList,
  DetailRow,
  DetailsSheet,
  MediaGrid,
  MetaChip,
  NoteBlock,
  PANEL_DANGER_BUTTON,
  PANEL_DATE_FORMAT,
  PanelBadge,
  PanelSection,
  PersonRow,
  RatingStars,
} from "@/components/app/details-panel";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/util/format-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const ProductActions = ({ product }: { product: ProductContent }) => {
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteProductMutation();

  const handleDelete = () => {
    deleteMutation.mutate(product.id, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white border shadow-lg min-w-[160px]"
        >
          <DropdownMenuItem
            onClick={() => setShowViewProduct(true)}
            className="cursor-pointer px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteConfirm(true)}
            className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DetailsSheet
        open={showViewProduct}
        onOpenChange={setShowViewProduct}
        title="Product details"
        badge={product.is_promoted ? <PanelBadge tone="blue">Promoted</PanelBadge> : undefined}
        description={`Listed ${formatDate(product.created_at, PANEL_DATE_FORMAT)}`}
        footer={
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className={PANEL_DANGER_BUTTON}
          >
            <Trash2 />
            Delete product
          </Button>
        }
      >
        <PanelSection title="Seller">
          <PersonRow
            person={{
              id: product.user.id,
              name: product.user.fullname,
              username: product.user.username,
              avatar: product.user.profile_picture,
            }}
          />
        </PanelSection>

        <PanelSection title="Product">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-gray-900">{product.name}</p>
            <p className="shrink-0 text-lg font-semibold text-primary">
              ₦{Number(product.price).toLocaleString()}
            </p>
          </div>
          <MediaGrid media={product.media_files} />
          <NoteBlock label="Description">
            {product.description?.trim() || "No description provided."}
          </NoteBlock>
          <div className="flex flex-wrap gap-2">
            <MetaChip icon={Tag}>{product.category}</MetaChip>
            {product.location && <MetaChip icon={MapPin}>{product.location}</MetaChip>}
          </div>
        </PanelSection>

        <PanelSection title="Ratings">
          <DetailList>
            <DetailRow label="Average rating">
              {product.average_rating ? (
                <RatingStars rating={Number(product.average_rating.toFixed(1))} />
              ) : (
                "No ratings yet"
              )}
            </DetailRow>
            <DetailRow label="Total ratings">
              {product.ratings_count.toLocaleString()}
            </DetailRow>
            <DetailRow label="Product ID">
              <span className="font-mono text-xs">#{product.id}</span>
            </DetailRow>
          </DetailList>
        </PanelSection>
      </DetailsSheet>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this product?"
        notice={{ text: "This action cannot be undone." }}
        confirmLabel="Delete Product"
        pendingLabel="Deleting..."
        confirmIcon={Trash2}
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export const useProductsColumns = () => {
  return useMemo<ColumnDef<ProductContent>[]>(() => [
    {
      accessorKey: "id",
      header: "Product ID",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="font-mono text-sm text-gray-700">#{product.id}</div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <img
              src={product.user.profile_picture}
              alt={product.user.username}
              className="h-8 w-8 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-avatar.png";
              }}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">
                {product.user.username}
              </div>
              <div className="text-xs text-gray-500">
                {product.user.fullname}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const hasMedia = product.media_files && product.media_files.length > 0;
        const truncatedDesc =
          product.description.length > 40
            ? `${product.description.slice(0, 40)}...`
            : product.description;

        return (
          <div className="max-w-md">
            <p className="text-sm font-medium text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500" title={product.description}>
              {truncatedDesc}
            </p>
            {hasMedia && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <ImageIcon className="h-3 w-3" />
                <span>{product.media_files.length} media file(s)</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm font-semibold text-gray-900">
            ₦{parseFloat(product.price).toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const product = row.original;
        const formatCategory = (cat: string) => {
          return cat
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        };

        return (
          <div className="flex items-center gap-1 text-xs">
            <Tag className="h-3 w-3 text-gray-500" />
            <span className="text-gray-700">
              {formatCategory(product.category)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "ratings",
      header: "Rating",
      cell: ({ row }) => {
        const product = row.original;
        const rating = product.average_rating || 0;

        return (
          <div className="text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-700">
                {rating > 0 ? rating.toFixed(1) : "No ratings"}
              </span>
            </div>
            {product.ratings_count > 0 && (
              <span className="text-gray-500">
                ({product.ratings_count} reviews)
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Posted On",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-gray-600">
            {moment(product.created_at).format("DD MMM, YYYY")}
          </div>
        );
      },
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const product = row.original;
    //     const isActive = true;

    //     return (
    //       <span
    //         className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
    //           isActive
    //             ? "bg-green-50 text-green-700 border-green-200"
    //             : "bg-red-50 text-red-700 border-red-200"
    //         }`}
    //       >
    //         {isActive ? "Active" : "Deleted"}
    //       </span>
    //     );
    //   },
    // },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <ProductActions product={row.original} />,
    },
  ], []);
};
