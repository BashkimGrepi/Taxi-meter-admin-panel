import { useMemo } from "react";
import { LiveOperations } from "../../../types/dashboard";
import { RideStatus } from "../../../types/schema";

export interface TransformedLiveOperation {
  id: string;
  driverName: string;
  progress: number; // 0-100
  duration: string; // "5 mins", "2 hours"
  durationMinutes: number; // Raw minutes for sorting/alerts
  date: string; // "Today" or formatted date
  pricingMode: string; // "Meter", "Fixed Price", "Custom"
  status: RideStatus;
  alertLevel: "normal" | "attention" | "critical";
  isCriticalDate: boolean; // True if not today (should never happen)
}

/**
 * Formats duration from startedAt to now as relative time
 */
function formatDuration(startedAt: string): { text: string; minutes: number } {
  const now = new Date();
  const started = new Date(startedAt);
  const diffMs = now.getTime() - started.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return { text: `${days} day${days > 1 ? "s" : ""}`, minutes };
  } else if (hours > 0) {
    return { text: `${hours} hour${hours > 1 ? "s" : ""}`, minutes };
  } else if (minutes > 0) {
    return { text: `${minutes} min${minutes > 1 ? "s" : ""}`, minutes };
  } else {
    return { text: "Just now", minutes: 0 };
  }
}

/**
 * Checks if date is today and formats accordingly
 */
function formatDate(startedAt: string): { text: string; isToday: boolean } {
  const started = new Date(startedAt);
  const now = new Date();

  const isToday =
    started.getDate() === now.getDate() &&
    started.getMonth() === now.getMonth() &&
    started.getFullYear() === now.getFullYear();

  if (isToday) {
    return { text: "Today", isToday: true };
  }

  // Format as "Feb 11, 2026"
  const formatted = started.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return { text: formatted, isToday: false };
}

/**
 * Maps ride status to progress percentage
 */
function getProgressFromStatus(status: RideStatus): number {
  const progressMap: Record<RideStatus, number> = {
    [RideStatus.CREATED]: 25, // Waiting for pickup
    [RideStatus.ONGOING]: 60, // In progress
    [RideStatus.COMPLETED]: 100, // Completed (shouldn't be in live ops)
    [RideStatus.CANCELLED]: 0, // Cancelled (shouldn't be in live ops)
  };

  return progressMap[status] || 0;
}

/**
 * Formats pricing policy for display
 */
function formatPricingMode(policy: string): string {
  const modeMap: Record<string, string> = {
    METER: "Meter",
    FIXED_PRICE: "Fixed Price",
    CUSTOM_FIXED: "Custom",
  };

  return modeMap[policy] || policy;
}

/**
 * Determines alert level based on ride duration
 */
function getAlertLevel(minutes: number): "normal" | "attention" | "critical" {
  if (minutes > 60) return "critical"; // Over 1 hour
  if (minutes > 30) return "attention"; // 30-60 mins
  return "normal";
}

/**
 * Hook to transform LiveOperations API response into table-ready data
 */
export const useLiveOperationsLogic = (
  data: LiveOperations | undefined,
    isLoading: boolean,
  isError: boolean,
) => {
  const tableData = useMemo(() => {
    if (!data || !data.ongoingRides) return [];

    return data.ongoingRides.map((ride) => {
      const { text: durationText, minutes: durationMinutes } = formatDuration(
        ride.startedAt,
      );
      const { text: dateText, isToday } = formatDate(ride.startedAt);

      return {
        id: ride.rideId,
        driverName: ride.driverName,
        progress: getProgressFromStatus(ride.status),
        duration: durationText,
        durationMinutes,
        date: dateText,
        pricingMode: formatPricingMode(ride.policy),
        status: ride.status,
        alertLevel: getAlertLevel(durationMinutes),
        isCriticalDate: !isToday, // Critical if not today
      } as TransformedLiveOperation;
    });
  }, [data]);

  // Sort by duration (newest first by default)
  const sortedData = useMemo(() => {
    return [...tableData].sort((a, b) => a.durationMinutes - b.durationMinutes);
  }, [tableData]);

  return {
    tableData: sortedData,
      isLoading,
        isError,
    totalRides: data?.counts.ongoingRides || 0,
    driversOnRide: data?.counts.driversOnRide || 0,
    hasData: tableData.length > 0,
    // Helper flags for UI
    hasCriticalRides: tableData.some((r) => r.alertLevel === "critical"),
    hasNonTodayRides: tableData.some((r) => r.isCriticalDate),
  };
};
