import { CustomTable } from "@/components/app/CustomTable";
import { PageHeader } from "@/components/app/PageHeader";
import { SearchInput } from "@/components/app/SearchInput";
import { StatCard } from "@/components/app/StatCard";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { Megaphone, Wallet, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

type AdStatus = "Active" | "Pending" | "Ended";

interface Ad {
  id: string;
  advertiser: string;
  engagements: string;
  status: AdStatus;
  duration: string;
  revenue: string;
  startDate: string;
  endDate: string;
}

// Placeholder data until the ads endpoints exist.
const PLACEHOLDER_ADS: Ad[] = [
  { id: "AD-1001", advertiser: "Tobi Olosunde", engagements: "1,240 / 8,900", status: "Active", duration: "30 days", revenue: "₦45,000", startDate: "01/01/2024", endDate: "31/01/2024" },
  { id: "AD-1002", advertiser: "Sandra Williams", engagements: "860 / 5,300", status: "Pending", duration: "14 days", revenue: "₦20,000", startDate: "05/01/2024", endDate: "19/01/2024" },
  { id: "AD-1003", advertiser: "John Doe", engagements: "2,105 / 12,400", status: "Ended", duration: "7 days", revenue: "₦12,500", startDate: "01/12/2023", endDate: "08/12/2023" },
];

const PLACEHOLDER_STATS: Array<{ title: string; value: string; icon: LucideIcon }> = [
  { title: "Total Ads", value: "3,434", icon: Megaphone },
  { title: "Active Ads", value: "3,400", icon: Megaphone },
  { title: "Inactive Ads", value: "34", icon: Megaphone },
  { title: "Total Revenue", value: "₦0", icon: Wallet },
];

const STATUS_STYLES: Record<AdStatus, string> = {
  Active: "bg-green-100 text-green-700 hover:bg-green-100",
  Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Ended: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

const adColumns: ColumnDef<Ad>[] = [
  {
    accessorKey: "id",
    header: "Ad ID",
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.id}</span>
    ),
  },
  { accessorKey: "advertiser", header: "Advertiser" },
  { accessorKey: "engagements", header: "Clicks / Views" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={`px-2 py-1 text-xs font-medium ${STATUS_STYLES[row.original.status]}`}>
        {row.original.status}
      </Badge>
    ),
  },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "revenue", header: "Revenue" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
];

const Ads = () => {
  const [searchValue, setSearchValue] = useState("");

  const ads = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    return term
      ? PLACEHOLDER_ADS.filter((ad) =>
          `${ad.id} ${ad.advertiser}`.toLowerCase().includes(term),
        )
      : PLACEHOLDER_ADS;
  }, [searchValue]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ads"
        description="Promoted content and advertising revenue."
        actions={
          <SearchInput
            placeholder="Search ads..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="w-full sm:w-80"
          />
        }
      />

      <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
        Preview only: ad metrics, creatives and moderation need backend endpoints.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLACEHOLDER_STATS.map(({ title, value, icon: Icon }) => (
          <StatCard key={title} title={title} value={value} icon={<Icon />} />
        ))}
      </div>

      <CustomTable
        columns={adColumns}
        data={ads}
        showSerialNumber={false}
        noDataText="No ads found."
      />
    </div>
  );
};

export default Ads;
