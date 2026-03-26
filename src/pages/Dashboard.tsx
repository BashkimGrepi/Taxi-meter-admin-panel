import { useState } from "react";
import {
  useBussinessStatus,
  useRevenueOverview,
  usePaymentSummary,
  useLiveOperations,
  usePerformanceTrendsQuery,
} from "../hooks/dashboard/useDashboardData";
import { useBusinessStatusLogic } from "../hooks/dashboard/logic/useBussinessStatusLogic";
import { useRevenueOverviewLogic } from "../hooks/dashboard/logic/useRevenueOverviewLogic";
import { usePaymentSummaryLogic } from "../hooks/dashboard/logic/usePaymentSummaryLogic";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../app/AuthProvider";
import KPICard from "../components/Dashboard/KPICard";
import RevenueOverview from "../components/Dashboard/RevenueOverview";
import PaymentSummaryChart from "../components/Dashboard/PaymentSummaryChart";
import { useLiveOperationsLogic } from "../hooks/dashboard/logic/useLiveOperationsLogic";
import { LiveOperationsTable } from "../components/Dashboard/liveOperationsTable";
import DriverActivityCard from "../components/Dashboard/DriverActivityCard";
import { PerformanceTrendsCard } from "../components/Dashboard/PerformanceTrendsCard";

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export default function Dashboard() {
  const [month, setMonth] = useState(yyyyMm());
  const { payload } = useAuth();
  const [period, setPeriod] = useState<"all_time" | "current_month" | "today">(
    "all_time",
  );

  // Fetch business status data (new query)
  const {
    data: bussinessStatus,
    isLoading: bussinessStatusLoading,
    isError: bussinessStatusError,
  } = useBussinessStatus({ period }); // or "current_month" or "all_time"

  // Transform business status data to KPI cards
  const { kpiCards } = useBusinessStatusLogic(
    bussinessStatus,
    bussinessStatusLoading,
  );

  // Fetch revenue overview data
  const { data: revenueOverviewData, isLoading: revenueLoading } =
    useRevenueOverview({ period });

  // Transform revenue data
  const { revenueData } = useRevenueOverviewLogic(
    revenueOverviewData,
    revenueLoading,
  );

  // Fetch payment summary data
  const { data: paymentSummaryData, isLoading: paymentLoading } =
    usePaymentSummary({ period });

  // Transform payment data
  const { paymentData } = usePaymentSummaryLogic(
    paymentSummaryData,
    paymentLoading,
  );

  // Fetch live operations data
  const {
    data: liveOpsData,
    isLoading: liveOpsLoading,
    isError: liveOpsError,
  } = useLiveOperations();

  // Extract message if data is a string
  const liveOpsMessage =
    typeof liveOpsData === "string" ? liveOpsData : undefined;

  // Type guard: Convert string response to undefined (when no rides available)
  const validLiveOpsData =
    typeof liveOpsData === "string" ? undefined : liveOpsData;
  const { tableData } = useLiveOperationsLogic(
    validLiveOpsData,
    liveOpsLoading,
    liveOpsError,
  );

  // Fetch performance trends data
  const {
    data: performanceTrendsData,
    isLoading: performanceTrendsLoading,
    isError: performanceTrendsError,
  } = usePerformanceTrendsQuery();

  if (bussinessStatusLoading && !bussinessStatus) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 space-y-6 animate-pulse">
        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white border border-gray-200 p-5"
            >
              <div className="flex justify-between mb-3">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-10 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white border border-gray-200 p-6 h-96">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-full bg-gray-200 rounded"></div>
          </div>
          <div className="lg:col-span-2 rounded-lg bg-white border border-gray-200 p-6 h-96">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (bussinessStatusError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load dashboard data
          </h3>
          <p className="text-gray-600 mb-4">
            {bussinessStatusError || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Business Status KPI Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <KPICard
              key={card.label}
              {...card}
              loading={bussinessStatusLoading}
            />
          ))}
        </div>
      </section>

      {/* Revenue Overview & Payment Summary Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RevenueOverview {...revenueData} loading={revenueLoading} />
        </div>
        <div className="lg:col-span-2">
          <PaymentSummaryChart {...paymentData} loading={paymentLoading} />
        </div>
      </section>

      {/* Performance Trends Section */}
      <section>
        <PerformanceTrendsCard
          data={performanceTrendsData}
          isLoading={performanceTrendsLoading}
          isError={performanceTrendsError}
          rangeLabel="Today"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOperationsTable
          data={tableData}
          isLoading={liveOpsLoading}
          message={liveOpsMessage}
        />
        <DriverActivityCard />
      </section>
    </div>
  );
}
