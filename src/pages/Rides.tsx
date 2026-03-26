import RidesToolbar from "../components/rides/RidesToolbar";
import RidesTable from "../components/rides/RidesTable";
import RideDetailsDrawer from "../components/rides/RideDetailsDrawer";
import { useRidesListLogic } from "../hooks/rides/useRidesListLogic";

/**
 * Main Rides Page
 * - URL-driven filters (copy/paste URL, back/forward navigation)
 * - Server state via React Query
 * - UI state (drawer) via useState
 */
export default function RidesPage() {
  // All logic extracted to custom hook
  const {
    data,
    isLoading,
    isError,
    error,
    filters,
    selectedRideId,
    handleFilterChange,
    handleReset,
    handleRowClick,
    handleDrawerClose,
    handleSort,
    handleNext,
    handlePrev,
    hasNext,
    hasPrev,
  } = useRidesListLogic();

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      
     

      {/* Filters Toolbar */}
      <RidesToolbar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Summary Cards (if you want to show summary) */}
      {data?.summary && !isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Total Rides"
            value={data.summary.ridesCount.toLocaleString()}
          />
          <SummaryCard
            label="Total Fare"
            value={`€${parseFloat(data.summary.totalFare).toLocaleString()}`}
          />
          <SummaryCard
            label="Completed"
            value={data.summary.byStatus.COMPLETED.toLocaleString()}
          />
          <SummaryCard
            label="Ongoing"
            value={data.summary.byStatus.ONGOING.toLocaleString()}
          />
        </div>
      )}

      {/* Rides Table */}
      <RidesTable
        data={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        sortBy={filters.sortBy}
        sortDir={filters.sortDir}
        onRowClick={handleRowClick}
        onSort={handleSort}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onReset={handleReset}
      />

      {/* Ride Details Drawer */}
      <RideDetailsDrawer
        rideId={selectedRideId}
        open={!!selectedRideId}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

/**
 * Summary Card Component
 */
function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
