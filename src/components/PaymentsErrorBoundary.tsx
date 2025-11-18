import { Component, ReactNode } from "react";
import { RefreshCw, CreditCard } from "lucide-react";

interface PaymentsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface PaymentsErrorBoundaryProps {
  children: ReactNode;
}

export class PaymentsErrorBoundary extends Component<
  PaymentsErrorBoundaryProps,
  PaymentsErrorBoundaryState
> {
  constructor(props: PaymentsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): PaymentsErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Payments Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Payment System Error
            </h3>

            <p className="text-slate-600 mb-4">
              We couldn't load your payment information. This might be a
              temporary issue with the payment system.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Payments
            </button>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
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
      );
    }

    return this.props.children;
  }
}
