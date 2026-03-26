import { useState } from "react";
import { Loader2, AlertCircle, Calendar, ChevronDown } from "lucide-react";
import { BarChartComponent } from "./components/BarChart";
import StatusCounts from "./components/statusCounts";
import { usePaymentsTransactionsLogic } from "../../hooks/payments&Transactions/logic/usePaymentsTransactionsLogic";
import { QueryParamsPeriod } from "../../types/payments&Transactions";

export default function NetWorthCard() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<QueryParamsPeriod["period"]>("all_time");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  const {
    chartData,
    totalNetWorth,
    growthPercentage,
    statusCounts,
    isLoading,
    error,
  } = usePaymentsTransactionsLogic(selectedPeriod);

  const periodLabels: Record<QueryParamsPeriod["period"], string> = {
    all_time: "All Time",
    current_month: "This Month",
    this_week: "This Week",
    this_year: "This Year",
  };

  const handlePeriodChange = (period: QueryParamsPeriod["period"]) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Total Net Worth
        </h2>

          {/* Period Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              <span>{periodLabels[selectedPeriod]}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Period Dropdown */}
            {showPeriodDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-40 z-50">
                {(
                  Object.entries(periodLabels) as [
                    QueryParamsPeriod["period"],
                    string,
                  ][]
                ).map(([period, label]) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors ${
                      selectedPeriod === period
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

      {/* Loading State */}
      {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-sm text-gray-600">Loading data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Failed to load data
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        )}

        {/* Success State - Show Data */}
        {!isLoading && !error && (
          <>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-green-600">
                {totalNetWorth}
              </div>
              <div className="flex items-center gap-2 mt-2 border border-green-200 bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                <span className="text-sm text-green-500">
                  {growthPercentage} from last month
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="w-full max-w-2xl">
                <BarChartComponent data={chartData} />
              </div>
            </div>

            <StatusCounts statusCounts={statusCounts} />
          </>
        )}
    </div>
  );
}
