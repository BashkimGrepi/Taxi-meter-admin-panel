import { Component, ReactNode } from "react";
import { RefreshCw, Building } from "lucide-react";

interface TenantSelectErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface TenantSelectErrorBoundaryProps {
  children: ReactNode;
}

export class TenantSelectErrorBoundary extends Component<
  TenantSelectErrorBoundaryProps,
  TenantSelectErrorBoundaryState
> {
  constructor(props: TenantSelectErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(
    error: Error
  ): TenantSelectErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      "TenantSelect Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building className="h-8 w-8 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Company Selection Error
              </h1>

              <p className="text-slate-600 mb-6 leading-relaxed">
                We couldn't load your company information. This might be a
                temporary issue.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Companies
              </button>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 transition-colors">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
