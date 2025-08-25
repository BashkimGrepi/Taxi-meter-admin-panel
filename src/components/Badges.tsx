import { PaymentStatus, RideStatus } from '../types/schema';

export function RideStatusBadge({ status }: { status: RideStatus }) {
  const cls =
    status === RideStatus.COMPLETED ? 'bg-green-100 text-green-800' :
    status === RideStatus.ONGOING   ? 'bg-blue-100 text-blue-800' :
    status === RideStatus.CANCELLED ? 'bg-gray-200 text-gray-700' :
                                      'bg-amber-100 text-amber-800';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs ${cls}`}>{status}</span>;
}

export function PaymentStatusBadge({ status }: { status?: PaymentStatus }) {
  if (!status) return <span className="text-xs text-gray-500">—</span>;
  const cls =
    status === PaymentStatus.PAID    ? 'bg-green-100 text-green-800' :
    status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-800' :
    status === PaymentStatus.CANCELED? 'bg-gray-200 text-gray-700' :
                                       'bg-red-100 text-red-800';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs ${cls}`}>{status}</span>;
}
