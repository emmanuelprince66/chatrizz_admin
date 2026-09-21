import {
  useFetchMarketplaceQuery,
  type MarketplaceProduct,
} from "@/api/marketplace/fetch-marketplace";
import { useProductStatusMutation } from "@/api/marketplace/product-actions";
import loginPlaceholder from "@/assets/login_one.png";
import { DatePickerWithRange } from "@/components/app/DateRangePicker";
import { PageHeader } from "@/components/app/PageHeader";
import { CustomTable } from "@/components/app/CustomTable";
import { SearchInput } from "@/components/app/SearchInput";
import { MarketProductSheet } from "@/components/app/marketplace/MarketProductSheet";
import { StatCard } from "@/components/app/StatCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Check,
  MoreHorizontal,
  Package,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

const productImage = loginPlaceholder;

interface Product {
  id: number;
  name: string;
  seller: string;
  price: string;
  date: string;
  status: "Available" | "Rejected";
  thumbnail: string;
  source: MarketplaceProduct;
}

/* Transactions flow is disabled until the backend provides a transactions endpoint.
type Transaction = [
  date: string,
  buyer: string,
  vendor: string,
  product: string,
  price: string,
];

// Placeholder data until the transactions and metrics endpoints exist.
const transactions: Transaction[] = [
  ["01/01/2024", "@sandra", "@tobi_o", "MacBook Pro 2025", "₦3,500,000"],
  ["01/01/2024", "@sandra", "@tobi_o", "MacBook Pro 2025", "₦3,500,000"],
  ["01/01/2024", "@ola01", "@john_doe", "MacBook Pro 2025", "₦3,500,000"],
  ["01/01/2024", "@ola01", "@tobi_o", "MacBook Pro 2025", "₦3,500,000"],
];
*/

const toApiDate = (date?: Date) =>
  date ? format(date, "yyyy-MM-dd") : undefined;

const toProduct = (product: MarketplaceProduct): Product => ({
  id: product.id,
  name: product.name,
  seller: product.user,
  price: `₦${Number(product.price).toLocaleString()}`,
  date: new Date(product.created_at).toLocaleDateString(),
  status: product.status === "APPROVED" ? "Available" : "Rejected",
  thumbnail:
    product.media_files.find((media) => media.media_type === "image")?.file ??
    productImage,
  source: product,
});

const ProductAction = ({
  product,
  onView,
  onDecision,
}: {
  product: Product;
  onView: () => void;
  onDecision: (decision: "approve" | "reject") => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        aria-label={`Actions for ${product.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-[150px] bg-white">
      <DropdownMenuItem onClick={onView}>View more</DropdownMenuItem>
      <DropdownMenuItem
        className="text-emerald-600"
        onClick={() => onDecision("approve")}
      >
        <Check className="mr-2 h-4 w-4" />
        Approve
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-red-500"
        onClick={() => onDecision("reject")}
      >
        <X className="mr-2 h-4 w-4" />
        Reject
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number>();
  // const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();
  const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>();
  const debouncedSearch = useDebounce(search, 500);

  const { data: marketplaceData, isLoading } = useFetchMarketplaceQuery({
    search: debouncedSearch || undefined,
    page: 1,
    limit: 15,
    start_date: toApiDate(dateRange?.from),
    end_date: toApiDate(dateRange?.to ?? dateRange?.from),
  });
  // Unfiltered and count-only, so the card shows every product uploaded regardless of search.
  const { data: totalProductsData, isLoading: isTotalLoading } =
    useFetchMarketplaceQuery({ page: 1, limit: 1 });
  const { mutate: updateProductStatus } = useProductStatusMutation();

  const products = useMemo(
    () => (marketplaceData?.results ?? []).map(toProduct),
    [marketplaceData],
  );
  // Looked up from the latest list so the panel reflects approve/reject immediately.
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  const productColumns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={row.original.thumbnail}
              alt=""
              className="h-9 w-9 rounded object-cover"
            />
            <span className="font-medium text-gray-800">
              {row.original.name}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "seller",
        header: "Vendor",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={
              row.original.status === "Available"
                ? "text-emerald-600"
                : "text-red-500"
            }
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ProductAction
              product={row.original}
              onDecision={(decision) =>
                updateProductStatus({ id: row.original.id, action: decision })
              }
              onView={() => {
                setSelectedProductId(row.original.id);
                setIsProductSheetOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    [updateProductStatus],
  );

/* Transactions flow disabled (see note above).
  const transactionColumns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      { id: "date", header: "Date", accessorFn: (row) => row[0] },
      { id: "buyer", header: "Buyer", accessorFn: (row) => row[1] },
      { id: "vendor", header: "Vendor", accessorFn: (row) => row[2] },
      { id: "product", header: "Product Name", accessorFn: (row) => row[3] },
      { id: "price", header: "Price", accessorFn: (row) => row[4] },
      {
        id: "action",
        header: "Action taken",
        cell: () => <span>Messaged vendor</span>,
      },
    ],
    [],
  );
*/

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description="Review and moderate products listed by users."
        actions={
          <>
            <SearchInput
              placeholder="Search products..."
              value={search}
              onValueChange={setSearch}
              className="w-full sm:w-64"
            />
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              className="w-full sm:w-64"
            />
            {dateRange?.from && (
              <Button
                variant="ghost"
                onClick={() => setDateRange(undefined)}
                className="h-10 rounded-full text-gray-600"
              >
                Clear dates
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={(totalProductsData?.count ?? 0).toLocaleString()}
          icon={<Package />}
          loading={isTotalLoading}
        />
      </div>

      <CustomTable
        columns={productColumns}
        data={products}
        showSerialNumber={false}
        loading={isLoading}
        noDataText="No products found."
      />

      <MarketProductSheet
        product={selectedProduct?.source}
        open={isProductSheetOpen}
        onOpenChange={setIsProductSheetOpen}
      />

      {/* Transactions flow disabled (see note at the top of the file).
      <Sheet
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(undefined)}
      >
        <SheetContent className="w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-md">
          <SheetHeader className="px-0 pb-2">
            <SheetTitle>Transaction details</SheetTitle>
          </SheetHeader>
          {selectedTransaction && (
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl bg-gray-100 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Product
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={productImage}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedTransaction[3]}</p>
                    <p className="text-sm text-[#0892D0]">
                      {selectedTransaction[4]}
                    </p>
                  </div>
                </div>
                <span className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                  Backend data required
                </span>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Buyer
                </p>
                <p className="mt-2 font-medium">{selectedTransaction[1]}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Vendor
                </p>
                <p className="mt-2 font-medium">{selectedTransaction[2]}</p>
              </div>
              <div className="rounded-2xl bg-gray-100 p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Action taken
                </p>
                <p className="mt-2 text-sm text-gray-700">Messaged vendor</p>
              </div>
              <Button variant="outline" className="w-full">
                Backend action required
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      */}

    </div>
  );
};


export default Marketplace;
