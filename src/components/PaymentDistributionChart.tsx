import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { fmtMoney } from "../utils/dates";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentDistributionData {
  card: { amount: number; percentage: number };
  cash: { amount: number; percentage: number };
  failed: { amount: number; percentage: number };
}

interface PaymentDistributionChartProps {
  data: PaymentDistributionData;
  isLoading?: boolean;
}

export default function PaymentDistributionChart({
  data,
  isLoading = false,
}: PaymentDistributionChartProps) {
  const chartData = {
    labels: ["Card/Digital", "Cash", "Failed"],
    datasets: [
      {
        data: [data.card.amount, data.cash.amount, data.failed.amount],
        backgroundColor: ["#3B82F6", "#F59E0B", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            return ` ${fmtMoney(value)}`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const total = data.card.amount + data.cash.amount + data.failed.amount;

  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">
        Payment Distribution
      </h3>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Chart */}
        <div className="relative">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-sm text-slate-400">Split</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-300">Card/Digital</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {data.card.percentage}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-slate-300">Cash</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {data.cash.percentage}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-300">Failed</span>
            </div>
            <span className="text-sm font-semibold text-red-400">
              {data.failed.percentage}%
            </span>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total Pending</span>
              <span className="text-sm font-semibold text-white">
                {fmtMoney(data.failed.amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
