import ProfitChart from "../components/Payments&Transactions.tsx/components/ProfitChart";
import NetWorthCard from "../components/Payments&Transactions.tsx/NetWorthCard";
import { PaymentsTable } from "../components/Payments&Transactions.tsx/PaymentsTable";

export default function Transactions() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Top Section: Net Worth + Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Net Worth Card with Status Counts */}
        <div className="lg:col-span-1">
          <NetWorthCard />
        </div>

        {/* Right Column - Revenue Chart */}
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
      </div>

      {/* Bottom Section: Payment Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">
            Payment Transactions
          </h2>
        </div>
        <PaymentsTable />
      </div>
    </div>
  );
}
