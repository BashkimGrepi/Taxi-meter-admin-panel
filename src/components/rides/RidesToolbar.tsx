import { useState, useDeferredValue } from "react";
import { RidesQueryParams, RideStatus, PaymentStatus } from "../../types/rides";
import { Search, X, Filter } from "lucide-react";

interface RidesToolbarProps {
  filters: RidesQueryParams;
  onChange: (filters: Partial<RidesQueryParams>) => void;
  onReset: () => void;
}

/**
 * Rides Toolbar - Filters UI
 * - Date range picker
 * - Status/payment filters
 * - Search box
 * - Reset button
 */
export default function RidesToolbar({
  filters,
  onChange,
  onReset,
}: RidesToolbarProps) {
  // Local state for search (debounced)
  const [searchValue, setSearchValue] = useState(filters.q || "");
  const deferredSearch = useDeferredValue(searchValue);

  // Update search in URL when debounced value changes
  useState(() => {
    if (deferredSearch !== filters.q) {
      onChange({ q: deferredSearch || undefined });
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Top Row: Date Range + Search + Reset */}
      <div className="flex flex-wrap gap-4">
        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">From:</label>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => onChange({ from: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">To:</label>
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => onChange({ to: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ride ID or payment ID..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Bottom Row: Status and Payment Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Filter className="w-4 h-4 text-gray-500" />

        {/* Ride Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <MultiSelect
            options={[
              { value: RideStatus.COMPLETED, label: "Completed" },
              { value: RideStatus.ONGOING, label: "Ongoing" },
              { value: RideStatus.CANCELLED, label: "Cancelled" },
              { value: RideStatus.DRAFT, label: "Draft" },
            ]}
            selected={filters.status?.split(",") || []}
            onChange={(values) =>
              onChange({ status: values.length ? values.join(",") : undefined })
            }
            placeholder="All statuses"
          />
        </div>

        {/* Payment Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Payment:</label>
          <MultiSelect
            options={[
              { value: PaymentStatus.PAID, label: "Paid" },
              { value: PaymentStatus.PENDING, label: "Pending" },
              { value: PaymentStatus.FAILED, label: "Failed" },
              {
                value: PaymentStatus.REQUIRES_ACTION,
                label: "Requires Action",
              },
              { value: PaymentStatus.REFUNDED, label: "Refunded" },
            ]}
            selected={filters.paymentStatus?.split(",") || []}
            onChange={(values) =>
              onChange({
                paymentStatus: values.length ? values.join(",") : undefined,
              })
            }
            placeholder="All payments"
          />
        </div>

        {/* Payment Method Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Method:</label>
          <select
            value={filters.method || ""}
            onChange={(e) => onChange({ method: e.target.value || undefined })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All methods</option>
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
          </select>
        </div>
      </div>

      {/* Active Filters Count */}
      {getActiveFiltersCount(filters) > 0 && (
        <div className="text-xs text-gray-600">
          {getActiveFiltersCount(filters)} filter(s) active
        </div>
      )}
    </div>
  );
}

/**
 * Multi-select dropdown component
 */
function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label
        : `${selected.length} selected`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] text-left"
      >
        <span className={selected.length === 0 ? "text-gray-400" : ""}>
          {displayText}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Count active filters (excluding defaults)
 */
function getActiveFiltersCount(filters: RidesQueryParams): number {
  let count = 0;
  if (filters.status) count++;
  if (filters.paymentStatus) count++;
  if (filters.provider) count++;
  if (filters.method) count++;
  if (filters.driverId) count++;
  if (filters.q) count++;
  return count;
}
