import { useAuth } from '../app/AuthProvider';
import { useTenant } from '../app/TenantProvider';

export default function Profile() {
  const { payload } = useAuth();
  const { tenant } = useTenant();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="text-sm">Email: {payload?.email ?? '—'}</div>
      <div className="text-sm">Company: {tenant?.name ?? '—'}</div>
      <div className="text-sm">Y-tunnus: {tenant?.businessId ?? '—'}</div>
    </div>
  );
}
