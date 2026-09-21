import {
  useFetchPaymentsQuery,
  type AdminPayment,
} from "@/api/payments/fetch-payments";
import { CustomTable } from "@/components/app/CustomTable";
import { PageHeader } from "@/components/app/PageHeader";
import { SearchInput } from "@/components/app/SearchInput";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Megaphone, Wallet } from "lucide-react";
import { useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-green-100 text-green-700 hover:bg-green-100",
  UNPAID: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
};

const getUserLabel = (user: AdminPayment["user"]) =>
  user?.full_name || (user?.username ? `@${user.username}` : "Unknown user");

// Payments are read-only, so there is no action column.
const paymentColumns: ColumnDef<AdminPayment>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.id}</span>
    ),
  },
  {
    id: "user",
    header: "User",
    accessorFn: (row) => getUserLabel(row.user),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => String(row.original.amount),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.source}</span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        className={`px-2 py-1 text-xs font-medium ${
          STATUS_STYLES[row.original.status.toUpperCase()] ??
          "bg-gray-100 text-gray-700"
        }`}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

const Payments = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, isLoading, isError } = useFetchPaymentsQuery({
    search: searchValue || undefined,
    page: 1,
    limit: 15,
  });

  const statsData = [
    { title: "Total Revenue", value: data?.metrics.total_revenue, icon: Wallet },
    { title: "Badge Payments", value: data?.metrics.badge_payment, icon: BadgeCheck },
    { title: "Ads", value: data?.metrics.ads, icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Revenue from badge subscriptions and ads."
        actions={
          <SearchInput
            placeholder="Search payments..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full sm:w-80"
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsData.map(({ title, value, icon: Icon }) => (
          <StatCard
            key={title}
            title={title}
            value={(value ?? 0).toLocaleString()}
            icon={<Icon />}
            loading={isLoading}
          />
        ))}
      </div>

      <CustomTable
        columns={paymentColumns}
        data={data?.results ?? []}
        loading={isLoading}
        showSerialNumber={false}
        noDataText={isError ? "Unable to load payments." : "No payments found."}
      />
    </div>
  );
};

export default Payments;
