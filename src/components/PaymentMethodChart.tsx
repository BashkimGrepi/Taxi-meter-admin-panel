import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MonthlyPaymentMethodsReport } from "../types/schema";
import { callback } from "chart.js/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PaymentMethodChartProps {
    data: MonthlyPaymentMethodsReport | undefined;
    isLoading: boolean;
}


export default function PaymentMethodChart({  data, isLoading }: PaymentMethodChartProps) {
    const chartData = { 
        labels: data?.paymentMethods.map(pm => pm.paymentMethod) || [],
        datasets: [
            {
                label: "Count",
                data: data?.paymentMethods.map(pm => pm.paymentCount) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: "rgb(99, 102, 241)",
                borderWidth: 1,
            },
            {
                label: "Amount $",
                data: data?.paymentMethods.map(pm => parseFloat(pm.totalAmount)) || [],
                backgroundColor: "rgba(34, 197, 94, 0.8)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 1,
            },
            {
                label: "Percentage %",
                data: data?.paymentMethods.map(pm => pm.percentage) || [],
                backgroundColor: "rgba(168, 85, 247, 0.8)",
                borderColor: "rgb(168, 85, 247)",
                borderWidth: 1,
            }
        ]
    };

    const options = {
      indexAxis: "y" as const,
      responsive: true,
      mainainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 11,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.dataset.label || "";
              const value = context.parsed.x;
              if (label === "Amount (€)") {
                return `${label}: €${value.toFixed(2)}`;
              } else if (label === "Percentage (%)") {
                return `${label}: ${value}%`;
              }
              return `${label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: "rgba(148, 163, 184, 0.1)",
          },
          ticks: {
            font: {
              size: 10,
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
          },
        },
      },
    };

    if (isLoading) {
        return (
          <div className="rounded-2xl bg-slate-50/70 px-4 py-3 flex items-center justify-center h-[160px]">
            <div className="text-xs text-slate-500">
              Loading payment methods...
            </div>
          </div>
        );
    }
    if (!data?.paymentMethods?.length) {
      return (
        <div className="rounded-2xl bg-slate-50/70 px-4 py-3 flex items-center justify-center h-[160px]">
          <div className="text-xs text-slate-500">
            No payment data available
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl bg-slate-50/70 px-4 py-3 h-[160px]">
        <div className="mb-2">
          <p className="text-xs text-slate-500">Payment Methods</p>
          <p className="text-sm font-semibold text-slate-900">
            {data?.summary?.totalPayments || 0} payments
          </p>
        </div>
        <div className="h-[100px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    );
}
