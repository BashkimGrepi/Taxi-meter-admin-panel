// Mirrors your Prisma enums/models we need in Phase 1. :contentReference[oaicite:1]{index=1}
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DRIVER = 'DRIVER',
}

export interface Membership {
  id?: string;
  userId?: string;
  tenantId: string;
  role: Role;
  invitedBy?: string | null;
  createdAt?: string;
}

// NOTE: payloads can differ between user types (admin/manager vs driver),
// so all optional here to be robust. :contentReference[oaicite:2]{index=2}
export interface JwtPayload {
  sub?: string;
  email?: string;

  // Admin/manager token
  role?: Role;          // "ADMIN" | "MANAGER" | "DRIVER"
  tenantId?: string;    // current tenant chosen (admin tokens always include this)
  tenantName?: string;  // optional convenience

  // Driver token (for the mobile app, not used in this admin UI)
  type?: 'driver';
  driverProfileId?: string;

  // Optional if you later mint multi-tenant tokens
  memberships?: Membership[];

  iat?: number;
  exp?: number;
}


export interface User {
  id: string;
  email: string;
  username?: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  businessId?: string | null; // Y-tunnus
  createdAt?: string;
  updatedAt?: string;
}


// ===== Driver & Invitation =====
export enum DriverStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface DriverProfile {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  email?: string | null;       // optional, if you store it on the profile too
  taxiNumber?: string | null;  // optional business field
  userId?: string | null;      // set when invitation accepted/linked
  status?: DriverStatus;       // backend may compute this based on invitation/user link
  createdAt?: string;
  updatedAt?: string;
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';

export interface Invitation {
  id: string;
  tenantId: string;
  email: string;
  role: Role;                  // usually DRIVER
  driverProfileId?: string | null;
  expiresAt?: string | null;
  status?: InvitationStatus;
  token?: string | null;       // may or may not be returned by API
  createdAt?: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ===== Rides & Payments =====
export enum RideStatus {
  CREATED = 'CREATED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentProvider {
  VIVA = 'VIVA',
  STRIPE = 'STRIPE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export interface Ride {
  id: string;
  tenantId: string;
  driverProfileId?: string | null;
  startedAt: string;          // ISO
  endedAt?: string | null;    // ISO
  durationMin?: number | null;
  distanceKm?: number | null;

  fareSubtotal?: number | null;
  taxAmount?: number | null;
  fareTotal?: number | null;

  status: RideStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  rideId?: string | null;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;

  authorizedAt?: string | null;
  capturedAt?: string | null;
  externalPaymentId?: string | null; // Viva/Stripe transaction id

  createdAt?: string;
  updatedAt?: string;
}

// Monthly summary used by the Dashboard/Transactions header
export interface MonthlyReportSummary {
  month: string;            // YYYY-MM (requested)
  from: string;             // ISO start
  to: string;               // ISO end
  ridesCount?: number;
  completedRatio?: number | null;
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
  activeDrivers?: number | null;
}

