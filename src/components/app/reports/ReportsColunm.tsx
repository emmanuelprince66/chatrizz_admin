import { type Report } from "@/api/reports/fetch-reports";
import { useResolveReportMutation } from "@/api/reports/resolve-report";
import { CustomModal } from "@/components/app/CustomModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  Image,
  Info,
  MessageSquare,
  MoreHorizontal,
  MoreHorizontal as MoreIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // or your toast library

export const useReportsRecentColumns = () => {
  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "reporter",
      header: "Reporter",
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="font-medium text-gray-900">
            {report.reporter?.username || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reason = row.original.reason;

        const getReasonConfig = (reason: string) => {
          const configs = {
            spam: {
              icon: AlertTriangle,
              className: "bg-yellow-50 text-yellow-700 border-yellow-200",
              label: "Spam",
            },
            harassment: {
              icon: MessageSquare,
              className: "bg-orange-50 text-orange-700 border-orange-200",
              label: "Harassment",
            },
            hate: {
              icon: Flame,
              className: "bg-red-50 text-red-700 border-red-200",
              label: "Hate Speech",
            },
            violence: {
              icon: AlertTriangle,
              className: "bg-red-50 text-red-700 border-red-200",
              label: "Violence",
            },
            misinformation: {
              icon: Info,
              className: "bg-purple-50 text-purple-700 border-purple-200",
              label: "Misinformation",
            },
            nudity: {
              icon: Image,
              className: "bg-pink-50 text-pink-700 border-pink-200",
              label: "Nudity",
            },
            other: {
              icon: MoreIcon,
              className: "bg-gray-50 text-gray-700 border-gray-200",
              label: "Other",
            },
          };

          return (
            configs[reason.toLowerCase() as keyof typeof configs] ||
            configs.other
          );
        };

        const config = getReasonConfig(reason);
        const Icon = config.icon;

        return (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => {
        const report = row.original;
        const details = report.details || "No details provided";
        const truncated =
          details.length > 50 ? `${details.slice(0, 50)}...` : details;

        return (
          <div className="max-w-md">
            <p className="text-sm text-gray-600 truncate" title={details}>
              {truncated}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const getStatusStyles = (status: string) => {
          const statusLower = status.toLowerCase();

          switch (statusLower) {
            case "processing":
              return "bg-blue-50 text-blue-700 border-blue-200";
            case "resolved":
            case "completed":
              return "bg-green-50 text-green-700 border-green-200";
            case "pending":
              return "bg-yellow-50 text-yellow-700 border-yellow-200";
            default:
              return "bg-gray-50 text-gray-700 border-gray-200";
          }
        };

        const formatStatus = (status: string) => {
          return status
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        };

        return (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}
            >
              {formatStatus(status)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Reported At",
      cell: ({ row }) => {
        const report = row.original;
        const date = new Date(report.created_at);

        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;
        const [showResolveConfirm, setShowResolveConfirm] = useState(false);
        const resolveReportMutation = useResolveReportMutation();

        const isResolved = report.status.toLowerCase() === "resolved";
        const isResolving = resolveReportMutation.isPending;

        const handleResolve = async () => {
          try {
            await resolveReportMutation.mutateAsync({ id: report.id });

            toast.success("Report resolved successfully");

            setShowResolveConfirm(false);
          } catch (error) {
            toast.error("Failed to resolve report", {
              description:
                "Please try again or contact support if the issue persists.",
            });
          }
        };

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white border border-gray-200 shadow-lg min-w-[160px]"
              >
                <DropdownMenuItem
                  onClick={() => setShowResolveConfirm(true)}
                  disabled={isResolved}
                  className={`cursor-pointer px-4 py-2 transition-colors flex items-center ${
                    isResolved
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  {isResolved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Already Resolved
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Resolve Report
                    </>
                  )}
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="cursor-pointer px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>

            <CustomModal
              isOpen={showResolveConfirm}
              onClose={() => setShowResolveConfirm(false)}
              trigger={false}
              title="Confirm Resolve Report"
            >
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to resolve this report from{" "}
                  <span className="font-semibold text-gray-900">
                    {report.reporter?.username}
                  </span>
                  ?
                </p>

                {report.details && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Report Details:
                    </p>
                    <p className="text-sm text-gray-700">{report.details}</p>
                  </div>
                )}

                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-800 font-medium">
                        About Report Resolution
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        This will mark the report as resolved. The reporter will
                        be notified and the report will be moved to the resolved
                        section.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowResolveConfirm(false)}
                    disabled={isResolving}
                    className="px-4 py-2 bg-gray-100 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isResolving ? (
                      <>
                        <Spinner size={"sm"} color="text-white" />
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Resolve Report
                      </>
                    )}
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
