import { DriverStatus } from '../types/schema';

export default function DriverRowStatus({ status }: { status?: DriverStatus }) {
  const label = status ?? '—';
  const cls =
    status === DriverStatus.ACTIVE
      ? 'bg-green-100 text-green-800'
      : status === DriverStatus.INVITED
      ? 'bg-amber-100 text-amber-800'
      : status === DriverStatus.INACTIVE
      ? 'bg-gray-200 text-gray-800'
      : 'bg-gray-100 text-gray-700';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs ${cls}`}>{label}</span>;
}
