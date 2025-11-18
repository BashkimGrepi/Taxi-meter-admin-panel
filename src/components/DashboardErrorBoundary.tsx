import { ErrorBoundary } from "./ErrorBoundary";
import { ReactNode } from "react";
import { BarChart3, RefreshCw } from "lucide-react";

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

export function DashboardErrorBoundary({
  children,
}: DashboardErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="space-y-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Dashboard Error
            </h2>

            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              We couldn't load your dashboard. This might be a temporary issue
              with data processing.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Dashboard
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
