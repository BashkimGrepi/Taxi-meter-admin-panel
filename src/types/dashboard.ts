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


