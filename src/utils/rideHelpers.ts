import { PaymentStatus, RideFlag, RideStatus } from "../types/rides";
import {
  AlertTriangle,
  Clock,
  CreditCard,
  DollarSign,
  LucideIcon,
} from "lucide-react";

/**
 * Format ride date/time for display
 */
export function formatRideDateTime(isoString: string | null): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format money with currency
 */
export function formatRideMoney(
  amount: string | null,
  currency: string = "EUR",
): string {
  if (!amount) return "—";
  const num = parseFloat(amount);
  if (isNaN(num)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

/**
 * Format distance
 */
export function formatDistance(km: string | null): string {
  if (!km) return "—";
  return `${parseFloat(km).toFixed(1)} km`;
}

/**
 * Format duration
 */
export function formatDuration(minutes: string | null): string {
  if (!minutes) return "—";
  const min = Math.round(parseFloat(minutes));
  return `${min} min`;
}

/**
 * Get ride status badge colors
 */
export function getRideStatusStyle(status: RideStatus): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case RideStatus.COMPLETED:
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Completed",
      };
    case RideStatus.ONGOING:
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        label: "Ongoing",
      };
    case RideStatus.CANCELLED:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        label: "Cancelled",
      };
    case RideStatus.DRAFT:
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Draft",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        label: status,
      };
  }
}

/**
 * Get payment status badge colors
 */
export function getPaymentStatusStyle(status: PaymentStatus): {
  bg: string;
  text: string;
  label: string;
} {
  switch (status) {
    case PaymentStatus.PAID:
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        label: "Paid",
      };
    case PaymentStatus.PENDING:
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        label: "Pending",
      };
    case PaymentStatus.FAILED:
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        label: "Failed",
      };
    case PaymentStatus.REQUIRES_ACTION:
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        label: "Action Required",
      };
    case PaymentStatus.REFUNDED:
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        label: "Refunded",
      };
    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-700",
        label: status,
      };
  }
}

/**
 * Get flag icon and label
 */
export function getFlagInfo(flag: RideFlag): {
  icon: LucideIcon;
  label: string;
  color: string;
} {
  switch (flag) {
    case "PAYMENT_FAILED":
      return {
        icon: AlertTriangle,
        label: "Payment Failed",
        color: "text-red-600",
      };
    case "PAYMENT_PENDING":
      return {
        icon: Clock,
        label: "Payment Pending",
        color: "text-yellow-600",
      };
    case "MISSING_PAYMENT":
      return {
        icon: CreditCard,
        label: "Missing Payment",
        color: "text-orange-600",
      };
    case "MISSING_ENDED_AT":
      return {
        icon: Clock,
        label: "Missing End Time",
        color: "text-orange-600",
      };
    case "FARE_ZERO":
      return { icon: DollarSign, label: "Zero Fare", color: "text-gray-600" };
    default:
      return { icon: AlertTriangle, label: flag, color: "text-gray-600" };
  }
}

/**
 * Get default date range (last 30 days)
 */
export function getDefaultDateRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);

  return {
    from: from.toISOString().split("T")[0], // "2026-02-06"
    to: to.toISOString().split("T")[0], // "2026-02-13"
  };
}
