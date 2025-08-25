import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';
import { useTenant } from '../app/TenantProvider';
import { getTenant } from '../services/tenantService';
import { Membership, Tenant } from '../types/schema';

type Row = { membership: Membership; tenant: Tenant | null };

export default function TenantSelect() {
  const { memberships } = useAuth();
  const { setTenantId } = useTenant();
  const navigate = useNavigate();

  const [rows, setRows] = useState<Row[]>([]);
  const ms = useMemo(() => memberships ?? [], [memberships]);

  useEffect(() => {
    let ok = true;
    async function load() {
      const out: Row[] = [];
      for (const m of ms) {
        try {
          const t = await getTenant(m.tenantId);
          if (!ok) return;
          out.push({ membership: m, tenant: t });
        } catch {
          out.push({ membership: m, tenant: null });
        }
      }
      if (ok) setRows(out);
    }
    load();
    return () => { ok = false; };
  }, [ms]);

  function choose(tenantId: string) {
    setTenantId(tenantId);
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold text-center">Choose a company</h1>

        {rows.length === 0 && (
          <p className="text-center text-gray-500">No memberships found for your account.</p>
        )}

        <ul className="space-y-3">
          {rows.map(({ membership, tenant }) => (
            <li key={`${membership.tenantId}-${membership.role}`}>
              <button
                onClick={() => choose(membership.tenantId)}
                className="w-full text-left border rounded p-3 hover:bg-gray-50"
              >
                <div className="font-medium">{tenant?.name ?? membership.tenantId}</div>
                <div className="text-xs text-gray-500">
                  Role: {membership.role} • Y-tunnus: {tenant?.businessId ?? '—'}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
