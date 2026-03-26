import { DollarSign, TrendingUp } from "lucide-react";

interface RevenueOverviewProps {
  fareSubtotal: number;
  taxCollected: number;
  totalRevenue: number;
  avgRideValue: number;
  //commission: number;
  currency?: string;
  trend?: {
    value: string;
    type: "positive" | "negative";
  };
  loading?: boolean;
}

export default function RevenueOverview({
  fareSubtotal,
  taxCollected,
  totalRevenue,
  avgRideValue,
  //commission,
  currency = "€",
  trend,
  loading = false,
}: RevenueOverviewProps) {
  const formatCurrency = (amount: number) => {
    return `${currency} ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
          <DollarSign className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Revenue Overview
        </h3>
      </div>

      {/* Fare Subtotal */}
      <div className="mb-5">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Fare Subtotal
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold text-gray-900 tabular-nums">
            {formatCurrency(fareSubtotal)}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                trend.type === "positive" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`h-4 w-4 ${trend.type === "negative" ? "rotate-180" : ""}`}
              />
              {trend.value}
            </div>
          )}
        </div>
      </div>

      {/* Tax Collected */}
      <div className="mb-5">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Tax Collected
        </div>
        <div className="text-2xl font-bold text-gray-900 tabular-nums">
          {formatCurrency(taxCollected)}
        </div>
      </div>

      {/* Total Revenue - Highlighted */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
          Total Revenue
        </div>
        <div className="text-4xl font-bold text-blue-600 tabular-nums">
          {formatCurrency(totalRevenue)}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Avg Ride Value
          </div>
          <div className="text-xl font-bold text-gray-900 tabular-nums">
            {formatCurrency(avgRideValue)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Commission
          </div>
          {/* <div className="text-xl font-bold text-gray-900 tabular-nums">
            {commission}%
          </div> */}
        </div>
      </div>
    </div>
  );
}
