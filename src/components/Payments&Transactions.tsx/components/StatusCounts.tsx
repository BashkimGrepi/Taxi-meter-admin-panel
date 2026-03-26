import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusCountsProps {
  statusCounts: {
    paid: number;
    pending: number;
    failed: number;
  };
}

export default function StatusCounts({ statusCounts }: StatusCountsProps) {
  const statuses = [
    {
      label: "Paid",
      count: statusCounts.paid,
      icon: CheckCircle2,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      borderClass: "border-green-100",
    },
    {
      label: "Pending",
      count: statusCounts.pending,
      icon: Clock,
      colorClass: "text-orange-600",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-100",
    },
    {
      label: "Failed",
      count: statusCounts.failed,
      icon: XCircle,
      colorClass: "text-red-600",
      bgClass: "bg-red-50",
      borderClass: "border-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {statuses.map((status) => {
        const Icon = status.icon;
        return (
          <div
            key={status.label}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border ${status.bgClass} ${status.borderClass}`}
          >
            <Icon className={`w-5 h-5 ${status.colorClass} mb-2`} />
            <div className={`text-2xl font-bold ${status.colorClass}`}>
              {status.count}
            </div>
            <div className="text-xs text-gray-600 mt-1">{status.label}</div>
          </div>
        );
      })}
    </div>
  );
}
