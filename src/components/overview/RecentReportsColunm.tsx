import { formatDate } from "@/util/format-date";
import { type ColumnDef } from "@tanstack/react-table";

// Define the reportsInfo type based on the provided data structure

export const useReportsRecentColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Report ID",
      cell: ({ row }) => {
        const reports = row.original;
        const shortId = reports.id.slice(0, 6);
        return <div className="font-mono text-sm">{shortId}</div>;
      },
    },
    {
      accessorKey: "reporter",
      header: "Reporter",
      cell: ({ row }) => {
        const reports = row.original;
        return <div className="font-medium">{reports?.reporter?.username}</div>;
      },
    },
    {
      accessorKey: "content_type",
      header: "Content Type",
      cell: ({ row }) => {
        const reports = row.original;
        const formatContentType = (type: string) => {
          return type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        };
        return (
          <div className="text-sm">
            {formatContentType(reports.content_type)}
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => {
        const reports = row.original;
        const formatReason = (reason: string) => {
          return reason.charAt(0).toUpperCase() + reason.slice(1);
        };
        return <div className="text-sm">{formatReason(reports.reason)}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const reports = row.original;
        return (
          <div className="text-sm">
            {formatDate(reports.created_at, "dd/MM/yyyy")}
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
              return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "resolved":
              return "bg-green-100 text-green-700 border-green-200";
            default:
              return "bg-gray-100 text-gray-700 border-gray-200";
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
              className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
          ${getStatusStyles(status)}
        `}
            >
              {formatStatus(status)}
            </span>
          </div>
        );
      },
    },
  ];

  return columns;
};
