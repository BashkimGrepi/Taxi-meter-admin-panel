import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface PaymentSummaryChartProps {
  paid: number;
  pending: number;
  failed: number;
  refunded: number;
  vivaAmount: number;
  cashAmount: number;
  vivaPercentage: number;
  cashPercentage: number;
  currency?: string;
  loading?: boolean;
}

export default function PaymentSummaryChart({
  paid,
  pending,
  failed,
  refunded,
  vivaAmount,
  cashAmount,
  vivaPercentage,
  cashPercentage,
  currency = "€",
  loading = false,
}: PaymentSummaryChartProps) {
  if (loading) {
    return (
      <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-6">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  // Calculate stroke properties for donut chart
  const total = vivaAmount + cashAmount;
  const vivaStroke = total > 0 ? (vivaPercentage / 100) * 314 : 0; // 314 ≈ 2π * 50
  const cashStroke = total > 0 ? (cashPercentage / 100) * 314 : 0;

  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-50 text-green-600 p-2.5 rounded-lg">
          <CreditCard className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Payment Situation
        </h3>
      </div>

      {/* Main Content: Donut Chart + Status Tiles */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg
              className="transform -rotate-90"
              width="192"
              height="192"
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
              />
              {/* Viva (Card) segment */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="20"
                strokeDasharray={`${vivaStroke} 314`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              {/* Cash segment */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="20"
                strokeDasharray={`${cashStroke} 314`}
                strokeDashoffset={-vivaStroke}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Total
              </div>
              <div className="text-xl font-bold text-gray-900">
                {currency}
                {total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Status Tiles - Vertical Stack */}
        <div className="flex flex-col gap-3">
          {/* Paid */}
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-gray-600">Paid</span>
            </div>
            <div className="text-xl font-bold text-emerald-600">{paid}</div>
          </div>

          {/* Pending */}
          <div className="rounded-lg bg-yellow-50 border border-yellow-100 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-xs font-medium text-gray-600">Pending</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">{pending}</div>
          </div>

          {/* Failed */}
          <div className="rounded-lg bg-red-50 border border-red-100 p-3">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600">Failed</span>
            </div>
            <div className="text-xl font-bold text-red-600">{failed}</div>
          </div>

          {/* Refunded */}
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">
                Refunded
              </span>
            </div>
            <div className="text-xl font-bold text-blue-600">{refunded}</div>
          </div>
        </div>
      </div>

      {/* Provider Stats - Side by Side at Bottom */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        {/* Viva (Card) */}
        <div className="p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700">
              VIVA (Card)
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {vivaPercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">
            {currency}
            {vivaAmount.toLocaleString()}
          </div>
        </div>

        {/* Cash */}
        <div className="p-3 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-sm bg-gray-500"></div>
            <span className="text-sm font-medium text-gray-700">Cash</span>
          </div>
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {cashPercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">
            {currency}
            {cashAmount.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
