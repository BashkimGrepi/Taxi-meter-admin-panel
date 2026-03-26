import { PaymentProvider, PaymentStatus, RideStatus } from "./schema";

export type QueryParamsPeriod = {
  period: "all_time" | "current_month" | "this_week" | "this_year";
};

// Sorting options for payments
export type PaymentSortField = "createdAt" | "capturedAt" | "amount";
export type SortDirection = "asc" | "desc";
export type CursorDirection = "next" | "prev";

export type PaymentFlag =
  | "REFUND_NEEDED" // Payment was refunded
  | "REQUIRES_ACTION" // Payment requires additional action
  | "FAILED" // Payment failed
  | "LONG_PENDING" // Payment pending for too long (>24 hours)
  | "MISSING_CAPTURE" // Payment authorized but not captured (>24 hours)
  | "MISSING_INVOICE" // Payment complete but no invoice number
  | "MISSING_RECEIPT"; // Payment complete but no receipt number

export interface GetPaymentsTransactionsResponse {
  period: {
    from: string;
    to: string;
  };
  fareSubtotal: string;
  taxAmount: string;
  fareTotal: string;
  comparison?: string;
  amounts: {
    byProvider: {
      provider: PaymentProvider;
      totalAmount: string;
      netAmount: string;
      taxAmount: string;
    }[];
    byStatus: {
      status: PaymentStatus;
      totalAmount: string;
      netAmount: string;
      taxAmount: string;
    }[];
  };
  counts: {
    total: number;
    byProvider: {
      provider: PaymentProvider;
      count: number;
    }[];
    byStatus: {
      status: PaymentStatus;
      count: number;
    }[];
  };
}

export enum ProfitGranularity {
  YEAR = "year", // Shows last 6 years
  MONTH = "month", // Shows all 12 months of current year
  WEEK = "week", // Shows all weeks of current month
  DAY = "day", // Shows all days of current week
}

export class GetProfitTimelineQueryDto {
  granularity?: ProfitGranularity = ProfitGranularity.MONTH;
  fromDate?: string;
  toDate?: string;
}

export interface ProfitChartResponse {
  granularity: ProfitGranularity;
  period: {
    from: string;
    to: string;
  };
  data: Array<{
    label: string; // Format: "2023" (year), "2023-01" (month), "2023-W12" (week)
    profit: string;
    timestamp: string; // ISO date for sorting/reference
  }>;
  total: string;
}

// TYPES FOR ENDPOINT: GET /admin/payments-transactions/payments

export class GetPaymentsQueryDto {
  // Time range filters
  from?: string;
  to?: string;

  // Status filter (comma-separated)
  status?: string;

  // Provider filter (comma-separated)
  provider?: string;

  // Driver filter
  driverId?: string;

  // Ride filter
  rideId?: string;

  // Text search
  q?: string;

  // Sorting
  sortBy?: PaymentSortField;
  sortDir?: SortDirection;

  // Pagination
  limit?: number;
  cursor?: string;
  cursorDir?: CursorDirection;
}

export interface PaymentRowDto {
  id: string;
  status: PaymentStatus;
  provider: PaymentProvider;

  // Amounts
  amount: string;
  taxAmount: string | null;
  netAmount: string | null;
  currency: string;

  // Timestamps
  createdAt: string;
  capturedAt: string | null;
  authorizedAt: string | null;

  // References
  externalPaymentId: string | null;
  invoiceNumber: string | null;
  receiptNumber: string | null;
  approvalCode: string | null;
  failureCode: string | null;

  // Ride data
  ride: {
    id: string;
    startedAt: string;
    endedAt: string | null;
    status: RideStatus;
    fareTotal: string;
    distanceKm: number;
    durationMin: number | null;
    driverProfile: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };

  // Flags for quick filtering
  flags: PaymentFlag[];
}

export interface PageInfoDto {
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
  totalInPage: number;
}

/**
 * Main response DTO
 */
export interface GetPaymentsResponseDto {
  payments: PaymentRowDto[];
  page: PageInfoDto;
}
