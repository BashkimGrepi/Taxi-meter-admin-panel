import { usePaymentsLogic } from "../hooks/usePaymentsLogic";
import { fmtDateTime, fmtMoney } from "../utils/dates";
import MonthPicker from "../components/MonthPicker";
import { PaymentStatusBadge } from "../components/Badges";
import RideDetailDrawer from "../components/RideDetailDrawer";
import ExportPaymentsModal from "../components/ExportPaymentsModal";
import { PaymentProvider, PaymentStatus } from "../types/schema";
import {
  CreditCard,
  Filter,
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Receipt,
} from "lucide-react";

export default function Payments() {
  const {
    month,
    status,
    provider,
    page,
    totalPages,
    drawerOpen,
    exportOpen,
    selectedPayment,
    data,
    selectedRide,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    isLoadingRide,
    handleMonthChange,
    handleStatusChange,
    handleProviderChange,
    handlePageChange,
    handleInspectPayment,
    handleCloseDrawer,
    handleOpenExport,
    handleCloseExport,
  } = usePaymentsLogic();

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Failed to load payments
          </h3>
          <p className="text-slate-600 mb-4">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700"
          >
            <CreditCard className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
           
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Payments
              </h1>
              <p className="text-slate-600 text-lg">Transaction history</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            View and manage payment transactions captured from your taxi meters.
            Export reports and inspect payment details.
          </p>
        </div>

        <button
          onClick={handleOpenExport}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:from-green-700 hover:to-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600/50 active:scale-[.98]"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </button>
      </div>

      {/* Filters Section */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Filter className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Filter & Search
            </h3>
            <p className="text-sm text-slate-500">
              Filter payments by date, status, and provider
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Month
            </label>
            <MonthPicker value={month} onChange={handleMonthChange} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Filter className="inline h-4 w-4 mr-2" />
              Status
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              <option value={PaymentStatus.PAID}>Paid</option>
              <option value={PaymentStatus.PENDING}>Pending</option>
              <option value={PaymentStatus.FAILED}>Failed</option>
              <option value={PaymentStatus.CANCELED}>Canceled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Receipt className="inline h-4 w-4 mr-2" />
              Provider
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as any)}
            >
              <option value="ALL">All Providers</option>
              <option value={PaymentProvider.VIVA}>Viva</option>
              <option value={PaymentProvider.STRIPE}>Stripe</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-slate-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Payment Transactions
                </h3>
                <p className="text-sm text-slate-500">
                  Total: {data?.total ?? 0} payments
                </p>
              </div>
            </div>
            {(isLoading || isFetching) && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                {isLoading ? "Loading..." : "Updating..."}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Captured
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Receipt #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Invoice #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Ride ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  External ID
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading && !data && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={9}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-500">
                        Loading payments...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {data && data.items.length === 0 && (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={9}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          No payments found
                        </p>
                        <p className="text-sm text-slate-500">
                          No payment transactions match your current filters
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {data &&
                data.items.map((payment) => (
                  <tr
                    key={payment.id}
                    className={`hover:bg-slate-50/50 transition-colors duration-200 ${
                      isPlaceholderData ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {fmtDateTime(
                        payment.capturedAt ??
                          payment.createdAt ??
                          payment.authorizedAt
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {payment.provider || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {fmtMoney(payment.amount, payment.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.receiptNumber ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.invoiceNumber ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {payment.rideId ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-32 truncate">
                      {payment.externalPaymentId ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleInspectPayment(payment)}
                          className="inline-flex items-center justify-center gap-1 h-9 px-3 rounded-xl border border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-200 text-sm font-medium"
                          title="Inspect payment details"
                        >
                          <Eye className="h-4 w-4" />
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold">{(page - 1) * 25 + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min(page * 25, data.total)}
              </span>{" "}
              of <span className="font-semibold">{data.total}</span> payments
            </div>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                <span className="px-3 py-2 text-sm font-medium text-slate-900">
                  Page {page} of {totalPages}
                </span>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <RideDetailDrawer
        open={drawerOpen}
        ride={selectedRide ?? null}
        payment={selectedPayment}
        onClose={handleCloseDrawer}
      />

      <ExportPaymentsModal
        open={exportOpen}
        defaultMonth={month}
        onClose={handleCloseExport}
      />
    </div>
  );
}
