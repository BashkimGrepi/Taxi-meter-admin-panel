import { RideStatus } from "./schema";

export interface TrendData {
  direction: "up" | "down" | "stable";
  percentage: number;
  previousValue: number;
  currentValue: number;
}

export interface AlertConfig {
  message: string;
  severity: "info" | "warning" | "critical";
  threshold?: number;
  isActive: boolean;
}

export interface EnhancedKPIData {
  id: string;
  title: string;
  value: number | string;
  format: "number" | "currency" | "percentage" | "fraction";
  icon?: string; // For Lucide icon names
  trend?: TrendData;
  status: "green" | "yellow" | "red" | "neutral";
  alert?: AlertConfig;
  subtitle?: string;
  loading?: boolean;
}

export interface DashboardSummary {
  kpis: EnhancedKPIData[];
  topPerformer?: {
    id: string;
    name: string;
    avatar?: string;
    rides: number;
    revenue: number;
    badge?: string; // emoji or icon
  };
  lastUpdated: Date;
  period: "today" | "week" | "month";
}

export type PeriodFilter = "today" | "week" | "month";

// new dashboard tyopes

export interface BussinessStatusResponse {
  range: {
    from: string;
    to: string;
  };
  rides: {
    total: number;
    completed: number;
    cancelled: number;
    failed?: number;
    ongoing: number;
  };
  health?: {
    status: string;
  };
}

export interface RevenueOverviewResponse {
  range: {
    from: string;
    to: string;
  };
  currency: string;
  totals: {
    fareSubtotal: number;
    taxAmount: number;
    fareTotal: number;
  };
  averages: {
    avgFareTotal: number;
  };
}

export interface PaymentSummaryResponse {
  range: {
    from: string;
    to: string;
  };
  currency: string;
  counts: {
    paid: number;
    pending: number;
    failed: number;
    refunded: number;
    requiresAction: number;
  };
  amounts: {
    paid: number;
    pending: number;
    failed: number;
    refunded: number;
  };
  breakdown: {
    method: {
      cash: {
        count: number;
        amount: number;
      };
      viva: {
        count: number;
        amount: number;
      };
    };
  };
}

enum RidePricingMode {
  FIXED_PRICE = "FIXED_PRICE",
  METER = "METER",
  CUSTOM_FIXED = "CUSTOM_FIXED",
}

export interface LiveOperations {
  ongoingRides: {
    rideId: string;
    driverProfileId: string;
    driverName: string;
    startedAt: string;
    policy: RidePricingMode;
    status: RideStatus;
  }[];
  counts: {
    ongoingRides: number;
    driversOnRide: number;
  };
}

export interface DriverActivity {
  drivers: {
    total: number;
    invited: number;
    active: number;
    inactive: number;
  };
}

export interface PerformanceTrendsResponse {
  interval: string;
  currency: string;
  points: {
    timestamp: string;
    ridesCompleted: number;
    fareTotal: number;
  }[];
  busiest: {
    time: string;
    ridesCompleted: number;
  };
}

export interface PerformanceTrendsResponse {
    interval: string;
    currency: string;
    points: {
        timestamp: string;
        ridesCompleted: number;
        fareTotal: number;
    }[],
    busiest: {
        time: string;
        ridesCompleted: number;
    }
}