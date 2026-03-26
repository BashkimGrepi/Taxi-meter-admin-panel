import { useMemo } from "react";
import { PerformanceTrendsResponse } from "../../../types/dashboard";

// Timezone for the company (can be moved to config later)
const COMPANY_TIMEZONE = "Europe/Helsinki";

interface TransformedPoint {
  timestamp: string; // ISO string in company timezone
  label: string; // "10:00" or "Feb 2"
  ridesCompleted: number;
  fareTotal: number;
  isBusiest: boolean;
}

interface PerformanceTrendsData {
  interval: string;
  currency: string;
  points: TransformedPoint[];
  busiest: {
    time: string;
    ridesCompleted: number;
    label: string;
  } | null;
  kpis: {
    totalRevenue: number;
    totalRides: number;
  };
  isEmpty: boolean;
}

/**
 * Convert UTC timestamp to company timezone
 */
function toCompanyTimezone(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Format timestamp for display based on interval
 */
function formatLabel(date: Date, interval: string): string {
  if (interval === "hour") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: COMPANY_TIMEZONE,
    });
  } else {
    // day interval
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: COMPANY_TIMEZONE,
    });
  }
}

/**
 * Generate all time buckets between from and to based on interval
 */
function generateTimeBuckets(from: Date, to: Date, interval: string): Date[] {
  const buckets: Date[] = [];
  const current = new Date(from);

  while (current < to) {
    buckets.push(new Date(current));
    if (interval === "hour") {
      current.setHours(current.getHours() + 1);
    } else {
      // day
      current.setDate(current.getDate() + 1);
    }
  }

  return buckets;
}

/**
 * Fill missing time buckets with zero values
 */
function fillMissingBuckets(
  points: PerformanceTrendsResponse["points"],
  interval: string,
): PerformanceTrendsResponse["points"] {
  if (points.length === 0) return [];

  // Parse all timestamps
  const existingPoints = new Map(points.map((p) => [p.timestamp, p]));

  // Find range
  const timestamps = points.map((p) => new Date(p.timestamp));
  const from = new Date(Math.min(...timestamps.map((d) => d.getTime())));
  const to = new Date(Math.max(...timestamps.map((d) => d.getTime())));

  // Add one interval to include the last point
  if (interval === "hour") {
    to.setHours(to.getHours() + 1);
  } else {
    to.setDate(to.getDate() + 1);
  }

  // Generate continuous timeline
  const allBuckets = generateTimeBuckets(from, to, interval);

  // Merge existing data with generated buckets
  return allBuckets.map((bucket) => {
    const key = bucket.toISOString();
    const existing = existingPoints.get(key);

    if (existing) {
      return existing;
    }

    // Find closest match (backend might have slightly different timestamp format)
    const tolerance = interval === "hour" ? 3600000 : 86400000; // 1 hour or 1 day in ms
    const closestPoint = points.find((p) => {
      const diff = Math.abs(new Date(p.timestamp).getTime() - bucket.getTime());
      return diff < tolerance;
    });

    if (closestPoint) {
      return closestPoint;
    }

    // Fill with zeros
    return {
      timestamp: key,
      ridesCompleted: 0,
      fareTotal: 0,
    };
  });
}

export const usePerformanceTrendsLogic = (
  data: PerformanceTrendsResponse | undefined,
  isLoading: boolean,
  isError: boolean,
): PerformanceTrendsData | null => {
  const performanceTrendsData = useMemo(() => {
    // Handle loading/error states
    if (isLoading || isError || !data) {
      return null;
    }

    // Handle empty data
    if (!data.points || data.points.length === 0) {
      return {
        interval: data.interval || "hour",
        currency: data.currency || "EUR",
        points: [],
        busiest: null,
        kpis: {
          totalRevenue: 0,
          totalRides: 0,
        },
        isEmpty: true,
      };
    }

    // Step 1: Fill missing time buckets for continuous timeline
    const filledPoints = fillMissingBuckets(data.points, data.interval);

    // Step 2: Calculate KPIs (totals)
    const totalRevenue = filledPoints.reduce(
      (sum, p) => sum + (Number(p.fareTotal) || 0),
      0,
    );
    const totalRides = filledPoints.reduce(
      (sum, p) => sum + (Number(p.ridesCompleted) || 0),
      0,
    );

    // Step 3: Transform points with timezone conversion and formatting
    const transformedPoints: TransformedPoint[] = filledPoints.map((point) => {
      const date = toCompanyTimezone(point.timestamp);
      const label = formatLabel(date, data.interval);
      const isBusiest = data.busiest
        ? point.timestamp === data.busiest.time
        : false;

      return {
        timestamp: point.timestamp,
        label,
        ridesCompleted: Number(point.ridesCompleted) || 0,
        fareTotal: Number(point.fareTotal) || 0,
        isBusiest,
      };
    });

    // Step 4: Prepare busiest info
    const busiestInfo = data.busiest
      ? {
          time: data.busiest.time,
          ridesCompleted: data.busiest.ridesCompleted,
          label: formatLabel(
            toCompanyTimezone(data.busiest.time),
            data.interval,
          ),
        }
      : null;

    // Check if all values are zero
    const isEmpty = totalRevenue === 0 && totalRides === 0;

    return {
      interval: data.interval,
      currency: data.currency,
      points: transformedPoints,
      busiest: busiestInfo,
      kpis: {
        totalRevenue,
        totalRides,
      },
      isEmpty,
    };
  }, [data, isLoading, isError]);

  return performanceTrendsData;
};
