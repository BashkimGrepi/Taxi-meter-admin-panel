import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, AlertCircle, Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useProfitTimelineLogic } from "../../../hooks/payments&Transactions/logic/useProfitTimelineLogic";
import { ProfitGranularity } from "../../../types/payments&Transactions";

export default function ProfitChart() {
  const [selectedGranularity, setSelectedGranularity] =
    useState<ProfitGranularity>(ProfitGranularity.YEAR);
  const [showGranularityDropdown, setShowGranularityDropdown] = useState(false);

  const { chartData, growthPercentage, isLoading, error } =
    useProfitTimelineLogic(selectedGranularity);

  const granularityLabels: Record<ProfitGranularity, string> = {
    [ProfitGranularity.YEAR]: "Yearly",
    [ProfitGranularity.MONTH]: "Monthly",
    [ProfitGranularity.WEEK]: "Weekly",
    [ProfitGranularity.DAY]: "Daily",
  };

  const handleGranularityChange = (granularity: ProfitGranularity) => {
    setSelectedGranularity(granularity);
    setShowGranularityDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Over Years</h2>

        <div className="flex items-center gap-3">
          <span className="text-sm text-green-600 font-semibold">
            {growthPercentage} Growth
          </span>

          {/* Granularity Selector */}
          <div className="relative">
            <button
              onClick={() =>
                setShowGranularityDropdown(!showGranularityDropdown)
              }
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>{granularityLabels[selectedGranularity]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Granularity Dropdown */}
            {showGranularityDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-36 z-50">
                {(
                  Object.entries(granularityLabels) as [
                    ProfitGranularity,
                    string,
                  ][]
                ).map(([granularity, label]) => (
                  <button
                    key={granularity}
                    onClick={() => handleGranularityChange(granularity)}
                    className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                      selectedGranularity === granularity
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-sm text-gray-600">Loading revenue data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Failed to load revenue data
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      )}

      {/* Chart */}
      {!isLoading && !error && (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value
                    ? [`€${value.toLocaleString()}`, "Revenue"]
                    : ["€0", "Revenue"]
                }
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
