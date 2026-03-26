import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { usePerformanceTrendsLogic } from "../../hooks/dashboard/logic/usePerformanceTrendsLogic";
import { PerformanceTrendsResponse } from "../../types/dashboard";
import { fmtMoney } from "../../utils/dates";
import { TrendingUp } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface PerformanceTrendsCardProps {
  data: PerformanceTrendsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  rangeLabel?: string; // "Today" / "Last 7 days"
}

export const PerformanceTrendsCard = ({
  data,
  isLoading,
  isError,
  rangeLabel = "Today",
}: PerformanceTrendsCardProps) => {
  const trendsData = usePerformanceTrendsLogic(data, isLoading, isError);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !trendsData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="text-red-600">Error loading performance trends</div>
      </div>
    );
  }

  // Empty state
  if (trendsData.isEmpty) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Trends
          </h3>
          <p className="text-sm text-gray-500">{rangeLabel}</p>
        </div>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No rides in this period
        </div>
      </div>
    );
  }

  // Prepare chart data
  const labels = trendsData.points.map((p) => p.label);
  const revenueData = trendsData.points.map((p) => p.fareTotal);
  const ridesData = trendsData.points.map((p) => p.ridesCompleted);
  const busiestIndices = trendsData.points
    .map((p, i) => (p.isBusiest ? i : -1))
    .filter((i) => i !== -1);

  // Chart 1: Revenue (Line Chart)
  const revenueChartData = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "rgb(59, 130, 246)", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: (context: any) => {
          // Highlight busiest point
          return busiestIndices.includes(context.dataIndex) ? 6 : 3;
        },
        pointBackgroundColor: (context: any) => {
          return busiestIndices.includes(context.dataIndex)
            ? "rgb(239, 68, 68)" // red-500 for busiest
            : "rgb(59, 130, 246)";
        },
        pointBorderColor: (context: any) => {
          return busiestIndices.includes(context.dataIndex)
            ? "rgb(220, 38, 38)"
            : "rgb(37, 99, 235)";
        },
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart 2: Rides (Bar Chart)
  const ridesChartData = {
    labels,
    datasets: [
      {
        label: "Rides",
        data: ridesData,
        backgroundColor: (context: any) => {
          // Highlight busiest bar
          return busiestIndices.includes(context.dataIndex)
            ? "rgba(239, 68, 68, 0.8)" // red-500 for busiest
            : "rgba(34, 197, 94, 0.8)"; // green-500
        },
        borderColor: (context: any) => {
          return busiestIndices.includes(context.dataIndex)
            ? "rgb(220, 38, 38)"
            : "rgb(22, 163, 74)";
        },
        borderWidth: 1,
      },
    ],
  };

  // Chart options for Line chart
  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false, // We show custom legend via KPIs
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += fmtMoney(context.parsed.y, trendsData.currency);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (typeof value === "number") {
              return value.toFixed(0);
            }
            return value;
          },
        },
      },
    },
  };

  // Chart options for Bar chart
  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " rides";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (typeof value === "number") {
              return value.toFixed(0);
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Performance Trends
          </h3>
          <span className="text-sm text-gray-500">{rangeLabel}</span>
        </div>

        {/* Optional: Interval toggle would go here */}
        {/* <div className="flex gap-2">
          <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700">Hour</button>
          <button className="px-3 py-1 text-sm rounded text-gray-600">Day</button>
        </div> */}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900">
            {fmtMoney(trendsData.kpis.totalRevenue, trendsData.currency)}
          </div>
        </div>

        {/* Total Rides */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Rides</div>
          <div className="text-2xl font-bold text-gray-900">
            {trendsData.kpis.totalRides}
          </div>
        </div>
      </div>

      {/* Busiest indicator */}
      {trendsData.busiest && trendsData.busiest.ridesCompleted > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">Busiest {trendsData.interval}:</span>{" "}
          {trendsData.busiest.label} ({trendsData.busiest.ridesCompleted} rides)
        </div>
      )}

      {/* Charts - Stacked */}
      <div className="space-y-6">
        {/* Chart 1: Revenue Line Chart */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            Revenue
          </div>
          <div className="h-48">
            <Line data={revenueChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Chart 2: Rides Bar Chart */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            Rides Completed
          </div>
          <div className="h-48">
            <Bar data={ridesChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
