import { type ProductContent } from "@/api/content/fetch-content";
import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContentHook } from "@/hooks/useContent";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";

export const useProductsColumns = () => {
  const columns: ColumnDef<ProductContent>[] = [
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
      cell: ({ row }) => {
        const product = row.original;
        const [showViewProduct, setShowViewProduct] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

        const handleSuccessDelete = () => {
          setIsDeleting(false);
          setShowDeleteConfirm(false);
        };
        const { handleDeleteProduct } = useContentHook({});

        const handleDelete = () => {
          setIsDeleting(true);
          handleDeleteProduct(product.id, handleSuccessDelete);
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

            {/* View Modal */}
            <CustomModal
              isOpen={showViewProduct}
              onClose={() => setShowViewProduct(false)}
              trigger={false}
              title="Product Details"
            >
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <img
                    src={product.user.profile_picture}
                    alt={product.user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{product.user.fullname}</div>
                    <div className="text-sm text-gray-500">
                      @{product.user.username}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ₦{parseFloat(product.price).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    {product.description}
                  </p>
                </div>

                {product.media_files && product.media_files.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-2">
                      Media ({product.media_files.length}):
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {product.media_files.map((media) => (
                        <img
                          key={media.id}
                          src={media.file}
                          alt="Product media"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average Rating</p>
                    <p className="text-sm font-medium">
                      {product.average_rating
                        ? product.average_rating.toFixed(1)
                        : "No ratings"}{" "}
                      ⭐
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Ratings</p>
                    <p className="text-sm font-medium">
                      {product.ratings_count}
                    </p>
                  </div>
                </div>
              </div>
            </CustomModal>

            {/* Delete Modal */}
            <CustomModal
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              trigger={false}
              title="Confirm Delete"
            >
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this product?
                </p>
                <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <p className="text-xs text-red-700">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete Product"}
                  </button>
                </div>
              </div>
            </CustomModal>
          </>
        );
      },
    },
  ];

  return columns;
};
