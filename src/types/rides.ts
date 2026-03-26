export enum RideStatus {
  DRAFT = "DRAFT",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  REQUIRES_ACTION = "REQUIRES_ACTION",
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentProvider {
  CASH = "CASH",
  VIVA = "VIVA",
}

export type PaymentMethod = "CASH" | "CARD";

export type RideFlag =
  | "PAYMENT_FAILED" // Payment status is FAILED
  | "PAYMENT_PENDING" // Payment status is PENDING
  | "MISSING_PAYMENT" // Completed ride with no payment
  | "MISSING_ENDED_AT" // Completed ride with no end time
  | "FARE_ZERO"; // Fare is 0 or null

// Request Query Params
export interface RidesQueryParams {
  // Time Range
  from?: string; // ISO date string (inclusive)
  to?: string; // ISO date string (exclusive)

  // Filters (comma-separated)
  status?: string; // e.g., "COMPLETED,CANCELLED"
  paymentStatus?: string; // e.g., "PAID,PENDING"
  provider?: string; // e.g., "VIVA,CASH"
  method?: string; // e.g., "CASH,CARD"

  // Single filters
  driverId?: string; // UUID
  q?: string; // Search ride ID or payment external ID

  // Sorting
  sortBy?: "startedAt" | "fareTotal" | "durationMin" | "distanceKm";
  sortDir?: "asc" | "desc";

  // Pagination
  limit?: number; // 1-100, default 20
  cursor?: string; // Opaque cursor from previous response
  cursorDir?: "next" | "prev";
}

// Response
export interface AdminRidesResponse {
  data: RideRow[];
  page: PageInfo;
  summary: RideSummary;
}

export interface RideRow {
  id: string;
  startedAt: string; // ISO date string
  endedAt: string | null;
  status: RideStatus;
  driver: {
    id: string;
    name: string; // "First Last" (combined)
  };
  durationMin: string | null; // "23.00"
  distanceKm: string | null; // "12.300"
  fareTotal: string | null; // "38.90"
  currency: string; // "EUR"
  payment: {
    status: PaymentStatus;
    provider: PaymentProvider;
    method: PaymentMethod;
    externalPaymentIdMasked: string | null; // "tx_****8891"
  } | null;
  flags: RideFlag[]; // ["PAYMENT_FAILED"]
}

export interface PageInfo {
  limit: number;
  nextCursor: string | null;
  prevCursor: string | null;
}

export interface RideSummary {
  ridesCount: number;
  totalFare: string; // "4200.50"
  totalTax: string; // "812.00"
  byStatus: {
    COMPLETED: number;
    CANCELLED: number;
    ONGOING: number;
    DRAFT: number;
  };
  byPaymentStatus: {
    PAID: number;
    PENDING: number;
    FAILED: number;
    REQUIRES_ACTION: number;
    REFUNDED: number;
  };
}



// ============================================
// Ride Detail Endpoint DTOs
// ============================================


export interface RideDetailResponseDto {
  id: string;
  status: RideStatus;
  startedAt: string;
  endedAt: string | null;
  durationMin: string | null;
  distanceKm: string | null;
  fareSubtotal: string | null;
  taxAmount: string | null;
  fareTotal: string | null;
  currency: string; // "EUR" or from payment
  driver: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string;
  };
  pricingPolicy: {
    id: string;
    name: string;
    baseFare: string;
    perMinute: string;
    perKm: string;
    createdAt: string;
  } | null;
  payment: {
    id: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    method: "CASH" | "CARD";
    amount: string;
    currency: string;
    authorizedAt: string | null;
    capturedAt: string | null;
    failureCode: string | null;
    externalPaymentId: string | null; // Full ID (not masked) for admin audit
  } | null;
}
