import {
  AlertCircle,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { PaymentRowDto } from "../../types/payments&Transactions";
import { PaymentStatus, PaymentProvider } from "../../types/schema";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { usePaymentsListLogic } from "../../hooks/payments&Transactions/logic/usePaymentsListLogic";

// Create column helper with proper typing
const columnHelper = createColumnHelper<PaymentRowDto>();

export function PaymentsTable() {
  const {
    data: rawData,
    isLoading,
    isError,
    selectedPaymentId,
    sorting,
    pagination,
    handleFilterChange,
    handleFilterReset,
    handleSortChange,
    handleRowClick,
    handleDraweClose,
    handleNextPage,
    handlePrevPage,
  } = usePaymentsListLogic();

  // ✅ Local state for search input (debounced)
  const [searchValue, setSearchValue] = useState("");

  //  Memoize data to create stable reference (prevents infinite loops!)
  // React Query already provides stable references, but we extract the payments array
  const data = useMemo(() => {
    return rawData?.payments || [];
  }, [rawData]);

  // Define columns with stable reference using useMemo to avoid infinite loops in useReactTable
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Payment ID",
        cell: (info) => info.getValue(),
        enableSorting: false, // Not sortable
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor("provider", {
        header: "Provider",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => `${info.row.original.currency} ${info.getValue()}`,
        enableSorting: true, // ✅ Sortable (server supports this)
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
        enableSorting: true, // ✅ Sortable
      }),
      columnHelper.accessor((row) => row.ride.driverProfile, {
        id: "driver",
        header: "Driver",
        cell: (info) => {
          const driver = info.getValue();
          return `${driver.firstName} ${driver.lastName}`;
        },
        enableSorting: false,
      }),
      columnHelper.accessor("ride.id", {
        header: "Ride ID",
        cell: (info) => info.getValue(),
        enableSorting: false,
      }),
    ],
    [],
  );

  // Initializing tanStack Table
  const table = useReactTable({
    data, // Stable reference -> useMemo
    columns, // Stable reference -> useMemo
    getCoreRowModel: getCoreRowModel(),

    // Server-side operations (manual mode)
    // insted of tanstack handling these we already handle them in our server
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,

    //sorting state and handler
    state: {
      sorting, // Current sort state from URL
    },
    onSortingChange: handleSortChange, // Handler to update URL when sorting changes
  });

  // loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading payments...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <AlertCircle className="h-6 w-6" />
        <span className="ml-2">Failed to load payments</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {/* Header Row */}
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? "flex items-center gap-2 cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {/*Sort indicator */}
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}

          {/* ✅ Filter Row - Embedded in Table */}
          <tr className="bg-white border-b border-gray-200">
            {/* Payment ID - No filter */}
            <th className="px-6 py-2">
              <div className="h-8"></div>
            </th>

            {/* Status Filter */}
            <th className="px-6 py-2">
              <select
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  handleFilterChange({ status: e.target.value || undefined })
                }
                defaultValue=""
              >
                <option value="">All Status</option>
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </th>

            {/* Provider Filter */}
            <th className="px-6 py-2">
              <select
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  handleFilterChange({ provider: e.target.value || undefined })
                }
                defaultValue=""
              >
                <option value="">All Providers</option>
                {Object.values(PaymentProvider).map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </th>

            {/* Amount - No filter */}
            <th className="px-6 py-2">
              <div className="h-8"></div>
            </th>

            {/* Created At - No filter */}
            <th className="px-6 py-2">
              <div className="h-8"></div>
            </th>

            {/* Driver - No filter */}
            <th className="px-6 py-2">
              <div className="h-8"></div>
            </th>

            {/* Ride ID - Search Filter */}
            <th className="px-6 py-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleFilterChange({ q: searchValue || undefined });
                    }
                  }}
                  className="w-full pl-8 pr-8 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchValue && (
                  <button
                    onClick={() => {
                      setSearchValue("");
                      handleFilterChange({ q: undefined });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.original.id)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No payments found</div>
      )}

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{pagination.totalInPage}</span>{" "}
              payment{pagination.totalInPage !== 1 ? "s" : ""}
            </div>
            <button
              onClick={() => {
                setSearchValue("");
                handleFilterReset();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear Filters
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={!pagination.hasPrev}
              className={
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md " +
                (pagination.hasPrev
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed")
              }
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className={
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md " +
                (pagination.hasNext
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed")
              }
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
