import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { TransformedLiveOperation } from "../../hooks/dashboard/logic/useLiveOperationsLogic";
import { AlertCircle, ArrowUpDown } from "lucide-react";

interface LiveOperationsTableProps {
  data: TransformedLiveOperation[];
  isLoading: boolean;
  message?: string; // Optional message from API (e.g., "no available rides")
}

export const LiveOperationsTable = ({
  data,
  isLoading,
  message,
}: LiveOperationsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Define columns
  const columns: ColumnDef<TransformedLiveOperation>[] = [
    {
      accessorKey: "driverName",
      header: "NAME",
      cell: ({ row }) => {
        const alertLevel = row.original.alertLevel;
        const isCritical = row.original.isCriticalDate;

        return (
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">
              {row.original.driverName}
            </span>
            {/* Alert indicators */}
            {(alertLevel === "critical" || isCritical) && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {alertLevel === "attention" && !isCritical && (
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "progress",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PROGRESS
            <ArrowUpDown className="h-3 w-3" />
          </button>
        );
      },
      cell: ({ row }) => {
        const progress = row.original.progress;
        const alertLevel = row.original.alertLevel;

        // Color based on alert level
        let progressColor = "bg-blue-500";
        if (alertLevel === "critical") progressColor = "bg-red-500";
        else if (alertLevel === "attention") progressColor = "bg-yellow-500";

        return (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-slate-700 min-w-[45px]">
              {progress}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-slate-900 transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DURATION
            <ArrowUpDown className="h-3 w-3" />
          </button>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">
          {row.original.duration}
        </span>
      ),
      sortingFn: (rowA, rowB) => {
        return rowA.original.durationMinutes - rowB.original.durationMinutes;
      },
    },
    {
      accessorKey: "date",
      header: "DATE",
      cell: ({ row }) => {
        const isCritical = row.original.isCriticalDate;
        return (
          <span
            className={`font-medium ${
              isCritical ? "text-red-600 font-bold" : "text-slate-700"
            }`}
          >
            {row.original.date}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Live Operations
            </h3>
            <div className="flex items-center gap-2">
              <div className="animate-pulse h-4 w-20 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-4 bg-slate-200 rounded flex-1" />
                <div className="h-4 bg-slate-200 rounded flex-1" />
                <div className="h-4 bg-slate-200 rounded flex-1" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Live Operations
            </h3>
          </div>
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg font-medium">
              {message || "No ongoing rides at the moment"}
            </div>
            <p className="text-slate-500 text-sm mt-2">
              Rides will appear here when drivers start trips
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Live Operations
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {data.length}
                </span>{" "}
                ongoing ride{data.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {table.getRowModel().rows.map((row) => {
                const alertLevel = row.original.alertLevel;
                const isCritical = row.original.isCriticalDate;

                // Row background color based on alert
                let rowBg = "bg-white hover:bg-slate-50";
                if (isCritical) rowBg = "bg-red-50 hover:bg-red-100";
                else if (alertLevel === "critical")
                  rowBg = "bg-red-50/50 hover:bg-red-50";
                else if (alertLevel === "attention")
                  rowBg = "bg-yellow-50/50 hover:bg-yellow-50";

                return (
                  <tr key={row.id} className={`transition-colors ${rowBg}`}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Normal (&lt; 30 mins)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span>Attention (30-60 mins)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Critical (&gt; 60 mins)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span>Requires immediate attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
