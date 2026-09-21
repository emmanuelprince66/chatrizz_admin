import {
  useDeletePostMutation,
  useDeleteProductMutation,
  useDeleteReviewMutation,
} from "@/api/content/delete-content";
import { useSuspendUserMutation } from "@/api/profile/suspend-users";
import type { Report } from "@/api/reports/fetch-reports";
import { useResolveReportMutation } from "@/api/reports/resolve-report";
import { getApiErrorMessage } from "@/api/utils";
import { ConfirmModal } from "@/components/app/ConfirmModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/util/format-date";
import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, MoreHorizontal, Trash2, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  formatContentType,
  getRemovableContentKind,
  ReasonBadge,
  ReportStatusBadge,
} from "./report-meta";
import { ReportDetailsSheet, type SuspendTarget } from "./ReportDetailsSheet";

// eslint-disable-next-line react-refresh/only-export-components
const ReportActions = ({ report }: { report: Report }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<SuspendTarget>();

  const resolveMutation = useResolveReportMutation();
  const suspendMutation = useSuspendUserMutation();
  const deletePostMutation = useDeletePostMutation();
  const deleteProductMutation = useDeleteProductMutation();
  const deleteReviewMutation = useDeleteReviewMutation();

  const isResolved = report.status === "RESOLVED";
  const removableKind = getRemovableContentKind(report.content_type);
  const deleteMutation =
    removableKind === "post"
      ? deletePostMutation
      : removableKind === "product"
        ? deleteProductMutation
        : deleteReviewMutation;

  const handleResolve = async () => {
    try {
      await resolveMutation.mutateAsync({ id: report.id });
      toast.success("Report resolved successfully");
      setShowResolveConfirm(false);
    } catch (error) {
      toast.error("Failed to resolve report", {
        description: getApiErrorMessage(error),
      });
    }
  };

  const handleRemoveContent = () => {
    if (!removableKind) return;
    // The delete mutation shows its own success and error toasts.
    deleteMutation.mutate(report.target_id, {
      onSuccess: () => setShowRemoveConfirm(false),
    });
  };

  const handleSuspendAuthor = async () => {
    if (!suspendTarget) return;
    try {
      await suspendMutation.mutateAsync({ id: suspendTarget.id });
      toast.success(`${suspendTarget.label} has been suspended`);
      setSuspendTarget(undefined);
    } catch (error) {
      toast.error("Failed to suspend user", {
        description: getApiErrorMessage(error),
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100">
            <span className="sr-only">Open report actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[190px] bg-white">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <Eye className="h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowResolveConfirm(true)}
            disabled={isResolved}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isResolved ? "Already resolved" : "Resolve report"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowRemoveConfirm(true)}
            disabled={!removableKind}
            className="text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            Remove content
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportDetailsSheet
        report={report}
        open={showDetails}
        onOpenChange={setShowDetails}
        onResolve={() => setShowResolveConfirm(true)}
        onRemoveContent={() => setShowRemoveConfirm(true)}
        onSuspendAuthor={setSuspendTarget}
      />

      <ConfirmModal
        isOpen={showResolveConfirm}
        onClose={() => setShowResolveConfirm(false)}
        onConfirm={handleResolve}
        title="Resolve report"
        message={
          <>
            Mark this report from{" "}
            <span className="font-semibold text-gray-900">
              @{report.reporter?.username}
            </span>{" "}
            as resolved?
          </>
        }
        notice={{
          text: "The report moves to the resolved list. The reported content is not removed.",
        }}
        tone="primary"
        confirmLabel="Resolve report"
        pendingLabel="Resolving..."
        confirmIcon={CheckCircle2}
        isPending={resolveMutation.isPending}
      />

      <ConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveContent}
        title="Remove content"
        message={`Permanently remove this ${formatContentType(
          report.content_type,
        ).toLowerCase()} from the platform?`}
        notice={{
          title: "This can't be undone",
          text: "The content is deleted for everyone. Resolve the report separately once you're done.",
        }}
        confirmLabel="Remove content"
        pendingLabel="Removing..."
        confirmIcon={Trash2}
        isPending={deleteMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!suspendTarget}
        onClose={() => setSuspendTarget(undefined)}
        onConfirm={handleSuspendAuthor}
        title="Suspend author"
        message={
          <>
            Suspend{" "}
            <span className="font-semibold text-gray-900">
              {suspendTarget?.label}
            </span>
            ?
          </>
        }
        notice={{
          text: "They won't be able to use the platform until the suspension is lifted.",
        }}
        tone="warning"
        confirmLabel="Suspend author"
        pendingLabel="Suspending..."
        confirmIcon={UserX}
        isPending={suspendMutation.isPending}
      />
    </>
  );
};

export const useReportsRecentColumns = () => {
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "id",
      header: "Report ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-700">
          {row.original.id.slice(0, 6)}
        </span>
      ),
    },
    {
      accessorKey: "reporter",
      header: "Reporter",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {row.original.reporter?.username
            ? `@${row.original.reporter.username}`
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "content_type",
      header: "Content Type",
      cell: ({ row }) => formatContentType(row.original.content_type),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => <ReasonBadge reason={row.original.reason} />,
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.original.created_at, "DD MMM YYYY")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <ReportStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ReportActions report={row.original} />,
    },
  ];

  return columns;
};
