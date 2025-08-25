import { PaymentStatus, RideStatus } from '../types/schema';

// Backend uses DRAFT for our CREATED
export function toApiRideStatus(s?: RideStatus | 'ALL'): string | undefined {
  if (!s || s === 'ALL') return undefined;
  if (s === RideStatus.CREATED) return 'DRAFT';
  return s; // ONGOING, COMPLETED, CANCELLED
}
export function fromApiRideStatus(s: string): RideStatus {
  switch (s) {
    case 'DRAFT': return RideStatus.CREATED;
    case 'ONGOING': return RideStatus.ONGOING;
    case 'COMPLETED': return RideStatus.COMPLETED;
    case 'CANCELLED': return RideStatus.CANCELLED;
    default: return s as RideStatus;
  }
}

// Backend spells it CANCELLED; our UI uses CANCELED
export function toApiPaymentStatus(s?: PaymentStatus | 'ALL'): string | undefined {
  if (!s || s === 'ALL') return undefined;
  if (s === PaymentStatus.CANCELED) return 'CANCELLED';
  return s; // PENDING, PAID, FAILED
}
export function fromApiPaymentStatus(s: string): PaymentStatus {
  if (s === 'CANCELLED') return PaymentStatus.CANCELED;
  if (s === 'PENDING' || s === 'PAID' || s === 'FAILED') return s as PaymentStatus;
  return s as PaymentStatus;
}
