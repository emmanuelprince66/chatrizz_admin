import {
  useFetchVerificationsQuery,
  type AdminVerification,
  type VerificationMetrics,
  type VerificationStatus,
  type VerificationType,
} from "@/api/verification/fetch-verifications";
import {
  useVerificationDecisionMutation,
  type VerificationDecision,
} from "@/api/verification/verification-actions";
import { FilterPills } from "@/components/app/FilterPills";
import { PageHeader } from "@/components/app/PageHeader";
import { CustomTable } from "@/components/app/CustomTable";
import { SearchInput } from "@/components/app/SearchInput";
import { StatCard } from "@/components/app/StatCard";
import VerificationDrawer from "@/components/app/verification/VerificationDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Building,
  Building2,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  User,
  Users,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const PAGE_SIZE = 15;
const FILTERS = ["All", "Approved", "Pending", "Rejected"] as const;
type StatusFilter = (typeof FILTERS)[number];

const TYPE_META: Record<
  VerificationType,
  { label: string; badgeLabel: string; icon: LucideIcon; color: string }
> = {
  INDIVIDUAL: {
    label: "Personal",
    badgeLabel: "Individual Badge",
    icon: User,
    color: "bg-blue-100 text-blue-700",
  },
  BUSINESS: {
    label: "Business",
    badgeLabel: "Business Badge",
    icon: Building,
    color: "bg-green-100 text-green-700",
  },
  ORGANIZATION: {
    label: "Organization",
    badgeLabel: "Organization Badge",
    icon: Building2,
    color: "bg-yellow-100 text-yellow-700",
  },
};

const BADGE_METRIC_KEYS: Record<VerificationType, keyof VerificationMetrics> = {
  INDIVIDUAL: "individual",
  BUSINESS: "business",
  ORGANIZATION: "organization",
};

const STATUS_STYLES: Record<VerificationStatus, string> = {
  APPROVED: "bg-green-100 text-green-700 hover:bg-green-100",
  PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  REJECTED: "bg-red-100 text-red-700 hover:bg-red-100",
};

const capitalize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const formatMetric = (value?: number) => (value ?? 0).toLocaleString();

const BadgeBreakdownCard = ({
  metrics,
  loading,
}: {
  metrics: VerificationMetrics;
  loading: boolean;
}) => (
  <div className="flex h-32 flex-col justify-center rounded-2xl border border-gray-100 bg-white px-5 shadow-sm">
    <div className="space-y-2">
      {(Object.keys(TYPE_META) as VerificationType[]).map((type) => {
        const { badgeLabel, icon: Icon, color } = TYPE_META[type];
        return (
          <div key={type} className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${color}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-gray-600">{badgeLabel}</span>
            </div>
            {loading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {formatMetric(metrics[BADGE_METRIC_KEYS[type]])}
              </span>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const Verification = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const [selectedVerification, setSelectedVerification] =
    useState<AdminVerification>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    data: verificationResponse,
    isLoading,
    isError,
  } = useFetchVerificationsQuery({
    search: searchValue || undefined,
    status:
      activeFilter === "All"
        ? undefined
        : (activeFilter.toUpperCase() as VerificationStatus),
    page,
    limit: PAGE_SIZE,
  });
  const verificationMutation = useVerificationDecisionMutation();
  const { mutate: decide, isPending: isDeciding } = verificationMutation;
  const pendingId = isDeciding ? verificationMutation.variables?.id : undefined;

  const metrics = verificationResponse?.metrics ?? {};
  const statsData = [
    { title: "Verified Accounts", value: metrics.active_badge, icon: CheckCircle },
    { title: "Active", value: metrics.active_users, icon: Users },
    { title: "Inactive", value: metrics.inactive_users, icon: UserX },
  ];

  const columns = useMemo<ColumnDef<AdminVerification>[]>(() => {
    const decisionItem = (
      verification: AdminVerification,
      decision: VerificationDecision,
    ) => {
      const isRowPending = pendingId === verification.id;
      return (
        <DropdownMenuItem
          className={decision === "reject" ? "text-red-600" : undefined}
          disabled={isDeciding}
          onClick={() => decide({ id: verification.id, decision })}
        >
          {isRowPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isRowPending
            ? "Processing..."
            : decision === "accept"
              ? "Approve"
              : "Reject"}
        </DropdownMenuItem>
      );
    };

    return [
      {
        id: "applicantName",
        header: "Applicant Name",
        accessorFn: (row) =>
          row.user.full_name || row.user.username || "Unknown applicant",
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const { label, icon: Icon } = TYPE_META[row.original.type];
          return (
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-600" />
              <span>{label}</span>
            </div>
          );
        },
      },
      {
        id: "plan",
        header: "Plan",
        cell: () => "—",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={`px-2 py-1 text-xs font-medium ${STATUS_STYLES[row.original.status]}`}
          >
            {capitalize(row.original.status)}
          </Badge>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.created_at).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open actions</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedVerification(row.original);
                  setIsDrawerOpen(true);
                }}
              >
                View Details
              </DropdownMenuItem>
              {decisionItem(row.original, "accept")}
              {decisionItem(row.original, "reject")}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [decide, isDeciding, pendingId]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification"
        description="Review badge applications and verification documents."
        actions={
          <SearchInput
            placeholder="Search applicants..."
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
            value={formatMetric(value)}
            icon={<Icon />}
            loading={isLoading}
          />
        ))}
        <BadgeBreakdownCard metrics={metrics} loading={isLoading} />
      </div>

      <FilterPills
        options={FILTERS}
        value={activeFilter}
        onChange={(filter) => {
          setActiveFilter(filter);
          setPage(1);
        }}
      />

      <CustomTable
        columns={columns}
        data={verificationResponse?.results ?? []}
        loading={isLoading}
        noDataText={
          isError
            ? "Unable to load verification requests."
            : "No verification requests found."
        }
        showSerialNumber={false}
        pagination={{
          currentPage: page,
          totalPages: verificationResponse?.totalPages ?? 0,
          pageSize: PAGE_SIZE,
          onPageChange: setPage,
          onPageSizeChange: () => setPage(1),
        }}
      />

      <VerificationDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        verification={selectedVerification}
        onDecision={(decision) => {
          if (selectedVerification) {
            decide({ id: selectedVerification.id, decision });
          }
        }}
        isDecisionPending={isDeciding}
        pendingDecision={verificationMutation.variables?.decision}
      />
    </div>
  );
};

export default Verification;
