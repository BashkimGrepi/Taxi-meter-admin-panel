import { useMemo } from "react";
import {
  BussinessStatusResponse,
} from "../../../types/dashboard";
import { Car, CheckCircle2, XCircle, Activity } from "lucide-react";
import { KPICardProps } from "../../../components/Dashboard/KPICard";

export const useBusinessStatusLogic = (
  data: BussinessStatusResponse | undefined,
  isLoading: boolean,
) => {
  const kpiCards: Omit<KPICardProps, "loading">[] = useMemo(() => {
    if (!data) {
      return [
        {
          label: "Total Rides",
          value: 0,
          icon: Car,
          iconColor: "text-blue-400",
          iconBg: "bg-blue-500/20",
          progress: 0,
          progressColor: "bg-blue-500",
        },
        {
          label: "Completed",
          value: 0,
          icon: CheckCircle2,
          iconColor: "text-green-400",
          iconBg: "bg-green-500/20",
          progress: 0,
          progressColor: "bg-green-500",
        },
        {
          label: "Cancelled",
          value: 0,
          icon: XCircle,
          iconColor: "text-red-400",
          iconBg: "bg-red-500/20",
        },
        {
          label: "Ongoing",
          value: 0,
          icon: Activity,
          iconColor: "text-blue-400",
          iconBg: "bg-blue-500/20",
          progress: 0,
          progressColor: "bg-blue-500",
        },
      ];
    }

    const { rides } = data;
    const total = rides.total || 0;

    // Calculate completion rate
    const completionRate =
      total > 0 ? Math.round((rides.completed / total) * 100) : 0;

    // Calculate cancellation rate
    const cancellationRate =
      total > 0 ? Math.round((rides.cancelled / total) * 100) : 0;

    return [
      {
        label: "Total Rides",
        value: rides.total,
        icon: Car,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/20",
        trend: {
          value: "+12.5%",
          type: "positive" as const,
        },
        progress: 100,
        progressColor: "bg-blue-500",
      },
      {
        label: "Completed",
        value: rides.completed,
        icon: CheckCircle2,
        iconColor: "text-green-400",
        iconBg: "bg-green-500/20",
        trend: {
          value: `${completionRate}%`,
          type: "positive" as const,
        },
        progress: completionRate,
        progressColor: "bg-green-500",
      },
      {
        label: "Cancelled",
        value: rides.cancelled,
        icon: XCircle,
        iconColor: "text-red-400",
        iconBg: "bg-red-500/20",
        trend: {
          value: `${cancellationRate}%`,
          type: "negative" as const,
        },
        progressColor: "bg-red-500",
      },
      {
        label: "Ongoing",
        value: rides.ongoing,
        icon: Activity,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/20",
        badge: {
          text: "Live Now",
          color: "text-blue-400 bg-blue-500/20",
        },
        progress: total > 0 ? Math.round((rides.ongoing / total) * 100) : 0,
        progressColor: "bg-blue-500",
      },
    ];
  }, [data]);

  return {
    kpiCards,
    isLoading,
  };
};
