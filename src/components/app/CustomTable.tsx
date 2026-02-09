"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Pagination } from "./Pagination";

interface CustomTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  noDataText?: string | React.ReactNode;
  tableHeader?: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  rowClassName?: string | ((row: Row<TData>) => string);
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  showSerialNumber?: boolean;
  showRadioButton?: boolean;
  selectedRowId?: string;
  onRowSelect?: (rowId: string) => void;
}

export function CustomTable<TData>({
  columns,
  data = [],
  loading = false,
  noDataText = "No data found",
  tableHeader,
  onRowClick,
  rowClassName,
  pagination,
  showSerialNumber = true,
  showRadioButton = false,
  selectedRowId,
  onRowSelect,
}: CustomTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalSelectedId, setInternalSelectedId] = useState<string>("");

  const currentSelectedId = selectedRowId ?? internalSelectedId;

  const tableColumns = [
    ...(showRadioButton
      ? [
          {
            id: "radioButton",
            header: () => <div className="w-8" />,
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="radio"
                  checked={currentSelectedId === row.id}
                  onChange={() => {
                    if (onRowSelect) {
                      onRowSelect(row.id);
                    } else {
                      setInternalSelectedId(row.id);
                    }
                  }}
                  className="w-4 h-4 text-blue-600 cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ),
            size: 50,
          } as ColumnDef<TData>,
        ]
      : []),
    ...(showSerialNumber
      ? [
          {
            id: "serialNumber",
            header: () => (
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                S/N
              </div>
            ),
            cell: ({ row }) => {
              const baseNumber = pagination
                ? (pagination.currentPage - 1) * pagination.pageSize +
                  row.index +
                  1
                : row.index + 1;
              return (
                <span className="text-sm font-medium text-gray-600">
                  {baseNumber.toString().padStart(2, "0")}
                </span>
              );
            },
            size: 60,
          } as ColumnDef<TData>,
        ]
      : []),
    ...columns,
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row: Row<TData>) => {
    if (showRadioButton) {
      if (onRowSelect) {
        onRowSelect(row.id);
      } else {
        setInternalSelectedId(row.id);
      }
    }
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const getRowClass = (row: Row<TData>) => {
    const isSelected = showRadioButton && currentSelectedId === row.id;
    const baseClass = "transition-all duration-150 bg-[#EEF0F1]";
    const hoverClass =
      onRowClick || showRadioButton
        ? "hover:bg-[#E6F4FA] cursor-pointer"
        : "hover:bg-[#E6F4FA]";
    const selectedClass = isSelected
      ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
      : "";
    const additionalClass =
      typeof rowClassName === "function" ? rowClassName(row) : rowClassName;

    return `${baseClass} ${hoverClass} ${selectedClass} ${additionalClass || ""}`;
  };

  const getCellClass = (index: number, totalCells: number) => {
    const isFirst = index === 0;
    const isLast = index === totalCells - 1;

    return `px-6 py-4 text-sm text-gray-700 border-0 ${
      isFirst ? "rounded-l-[40px]" : ""
    } ${isLast ? "rounded-r-[40px]" : ""}`;
  };

  const getHeaderCellClass = (
    canSort: boolean,
    index: number,
    totalHeaders: number,
  ) => {
    const isFirst = index === 0;
    const isLast = index === totalHeaders - 1;

    let borderClass = "border-t-2 border-b-2 border-cyan-500";
    if (isFirst) {
      borderClass += " border-l-2 rounded-tl-[40px]";
    }
    if (isLast) {
      borderClass += " border-r-2 rounded-tr-[40px]";
    }

    return `px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50/80 ${borderClass} ${
      canSort
        ? "cursor-pointer select-none hover:bg-gray-100 transition-colors"
        : ""
    }`;
  };

  return (
    <div className="bg-white w-full">
      {tableHeader && (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          {tableHeader}
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        table {
          border-collapse: separate !important;
          border-spacing: 0 0.75rem !important;
        }
      `,
        }}
      />

      <div className="overflow-x-auto px-4">
        <Table>
          <TableHeader className="[&_tr]:border-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-0"
              >
                {headerGroup.headers.map((header, index) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className={getHeaderCellClass(
                        canSort,
                        index,
                        headerGroup.headers.length,
                      )}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className="flex items-center gap-2 group"
                          onClick={
                            canSort
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <span className="flex-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {canSort && (
                            <span className="flex-shrink-0">
                              {isSorted === "asc" ? (
                                <ArrowUp className="h-4 w-4 text-blue-600" />
                              ) : isSorted === "desc" ? (
                                <ArrowDown className="h-4 w-4 text-blue-600" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-0 bg-white">
            {loading ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-[400px] text-center px-4 border-0"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    {/* Modern loading spinner */}
                    <div className="relative w-16 h-16">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Loading data
                      </span>
                      <span className="text-xs text-gray-500">
                        Please wait while we fetch your data...
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={getRowClass(row)}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={getCellClass(
                        index,
                        row.getVisibleCells().length,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-[400px] text-center border-0"
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    {/* Empty state icon */}
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {typeof noDataText === "string" ? (
                        <>
                          <span className="text-sm font-medium text-gray-700">
                            {noDataText}
                          </span>
                          <span className="text-xs text-gray-500">
                            Try adjusting your filters or search criteria
                          </span>
                        </>
                      ) : (
                        noDataText
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && !loading && table.getRowModel().rows?.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/30">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
