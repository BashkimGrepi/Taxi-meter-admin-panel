import { RideRow, RidesQueryParams } from "../../types/rides";
import {
  formatRideDateTime,
  formatRideMoney,
  formatDistance,
  formatDuration,
  getRideStatusStyle,
  getPaymentStatusStyle,
  getFlagInfo,
} from "../../utils/rideHelpers";
import { ChevronUp, ChevronDown, AlertCircle, RefreshCw } from "lucide-react";

interface RidesTableProps {
  data: RideRow[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  sortBy?: RidesQueryParams["sortBy"];
  sortDir?: RidesQueryParams["sortDir"];
  onRowClick: (rideId: string) => void;
  onSort: (sortBy: RidesQueryParams["sortBy"]) => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onReset: () => void;
}

/**
 * Rides Table Component
 * - Table rendering with sortable columns
 * - Loading skeleton
 * - Error state
 * - Empty state
 * - Pagination controls
 */
export default function RidesTable({
  data,
  isLoading,
  isError,
  error,
  sortBy,
  sortDir,
  onRowClick,
  onSort,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onReset,
}: RidesTableProps) {
  // Error State
  if (isError) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load rides
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!isLoading && data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🚕</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No rides found
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Try adjusting your filters to see more results
          </p>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <SortableHeader
                label="Started At"
                sortKey="startedAt"
                currentSort={sortBy}
                currentDir={sortDir}
                onSort={onSort}
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <SortableHeader
                label="Duration"
                sortKey="durationMin"
                currentSort={sortBy}
                currentDir={sortDir}
                onSort={onSort}
              />
              <SortableHeader
                label="Distance"
                sortKey="distanceKm"
                currentSort={sortBy}
                currentDir={sortDir}
                onSort={onSort}
              />
              <SortableHeader
                label="Fare"
                sortKey="fareTotal"
                currentSort={sortBy}
                currentDir={sortDir}
                onSort={onSort}
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Flags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              // Loading Skeleton
              <>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 bg-gray-200 rounded w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              // Actual Data
              data.map((ride) => (
                <tr
                  key={ride.id}
                  onClick={() => onRowClick(ride.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatRideDateTime(ride.startedAt)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {ride.driver.name}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={ride.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDuration(ride.durationMin)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDistance(ride.distanceKm)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {formatRideMoney(ride.fareTotal, ride.currency)}
                  </td>
                  <td className="px-4 py-4">
                    {ride.payment ? (
                      <div className="space-y-1">
                        <PaymentBadge status={ride.payment.status} />
                        <div className="text-xs text-gray-500">
                          {ride.payment.method} • {ride.payment.provider}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <FlagsCell flags={ride.flags} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && data.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {data.length} ride{data.length !== 1 ? "s" : ""} shown
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sortable Table Header
 */
function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string;
  sortKey: RidesQueryParams["sortBy"];
  currentSort?: RidesQueryParams["sortBy"];
  currentDir?: RidesQueryParams["sortDir"];
  onSort: (sortBy: RidesQueryParams["sortBy"]) => void;
}) {
  const isActive = currentSort === sortKey;

  return (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col">
          <ChevronUp
            className={`w-3 h-3 -mb-1 ${isActive && currentDir === "asc" ? "text-blue-600" : "text-gray-400"}`}
          />
          <ChevronDown
            className={`w-3 h-3 ${isActive && currentDir === "desc" ? "text-blue-600" : "text-gray-400"}`}
          />
        </div>
      </div>
    </th>
  );
}

/**
 * Status Badge
 */
function StatusBadge({ status }: { status: RideRow["status"] }) {
  const style = getRideStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

/**
 * Payment Badge
 */
function PaymentBadge({
  status,
}: {
  status: NonNullable<RideRow["payment"]>["status"];
}) {
  const style = getPaymentStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

/**
 * Flags Cell
 */
function FlagsCell({ flags }: { flags: RideRow["flags"] }) {
  if (flags.length === 0)
    return <span className="text-sm text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((flag) => {
        const info = getFlagInfo(flag);
        const IconComponent = info.icon;
        return (
          <span key={flag} className={`${info.color}`} title={info.label}>
            <IconComponent className="h-4 w-4" />
          </span>
        );
      })}
    </div>
  );
}
