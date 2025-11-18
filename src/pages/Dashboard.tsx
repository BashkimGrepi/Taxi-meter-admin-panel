import { useState } from "react";
import { useDashboardData, useDashboardPaymentData } from "../hooks/useDashboardData";
import { useDashboardLogic } from "../hooks/useDashboardLogic";
import { Link } from "react-router-dom";
import { BarChart3, Car, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "../app/AuthProvider";
import PaymentMethodChart from "../components/PaymentMethodChart";

function yyyyMm(d = new Date()) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

export default function Dashboard() {
  const [month, setMonth] = useState(yyyyMm());
  const { payload } = useAuth();
  const { data: summary, isLoading, isError, error } = useDashboardData(month);
  const { data: paymentData, isLoading: paymentLoading, isError: paymentError, error: paymentErrorMessage } = useDashboardPaymentData(month);
  const { kpiCards } = useDashboardLogic(summary, isLoading);

  if (isLoading && !summary) {
    return (
      <div className="space-y-8 animate-pulse">
        
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-slate-200 rounded-2xl"></div>
              <div>
                <div className="h-8 w-48 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
            <div className="h-4 w-96 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
            <div className="h-10 w-40 bg-slate-200 rounded-xl"></div>
          </div>
        </div>

        {/* KPI Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200 p-6"
            >
              <div className="flex justify-between mb-4">
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg mb-2"></div>
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Failed to load dashboard data
          </h3>
          <p className="text-slate-600 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700"
          >
            <ArrowRight className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section 
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">


        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Reporting Period</span>
          </div>
          <MonthPicker value={month} onChange={setMonth} />
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50 active:scale-[.98]"
          >
            View Transactions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      */}

      <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
        Overview of your taxi fleet operations for the current month.  
      </p>
      {/* KPI Cards Section */}
      <div className="space-y-6">
        {/* === TOP GRID: LEFT (KPIs) + RIGHT (Activities) === */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          {/* LEFT COLUMN – KPI OVERVIEW CARD (like Offline/Online department) */}
          <section className="space-y-6">
            <div className="rounded-3xl bg-white/80 border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Overview
                  </h2>
                  <p className="text-xs text-slate-400">
                    Updated · {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xs">
                  Full
                </button>
              </div>

              {/* KPI Cards inside the card, softer look */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {kpiCards.map((card) => {
                  const IconComponent = card.icon;
                  return (
                    <div
                      key={card.label}
                      className="rounded-2xl bg-slate-50/70 px-4 py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs text-slate-500">{card.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">
                          {isLoading ? "…" : card.value}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <IconComponent className="h-5 w-5 text-slate-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN – ACTIVITIES-STYLE CARD */}
          <section className="space-y-6">
            <div className="rounded-3xl bg-white/70 border border-white/60 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Activities
                </h2>
                <span className="text-xs text-slate-400">Today</span>
              </div>

              <div>
              <PaymentMethodChart data={paymentData} isLoading={isLoading} />
              </div>
            </div>
          </section>
        </div>

        {/* === BOTTOM – TASKS (your Quick Actions turned into a list) === */}
        <section className="rounded-3xl bg-white/80 border border-white/60 shadow-sm p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Tasks</h2>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                All departments
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xl">
                +
              </button>
            </div>
          </div>

          {/* Turn the 3 Quick Action boxes into a vertical list like in the screenshot */}
          <div className="divide-y divide-slate-100">
            <Link
              to="/drivers"
              className="flex items-center justify-between gap-4 py-3 px-2 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Car className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Manage Drivers
                  </p>
                  <p className="text-xs text-slate-500">
                    View and edit driver profiles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-xs">Open</span>
              </div>
            </Link>

            <Link
              to="/payments"
              className="flex items-center justify-between gap-4 py-3 px-2 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    View Payments
                  </p>
                  <p className="text-xs text-slate-500">
                    Track financial transactions
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/pricing"
              className="flex items-center justify-between gap-4 py-3 px-2 rounded-2xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Pricing Policies
                  </p>
                  <p className="text-xs text-slate-500">
                    Configure rate structures
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
