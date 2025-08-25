import { ReactNode, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Role } from '../types/schema';
import { useAuth } from '../app/AuthProvider';
import { isTokenExpired } from '../utils/jwt';
import { getStoredTenantId } from '../services/AxiosInstance';

export default function ProtectedRoute({
  children,
  allow = [Role.ADMIN, Role.MANAGER],
  requireTenant = true,
}: {
  children: ReactNode;
  allow?: Role[];
  requireTenant?: boolean;
}) {
  const { token, payload } = useAuth();
  const location = useLocation();

  if (!token || isTokenExpired(token) || !payload) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Roles from memberships (preferred) or top-level fallback
  const hasAllowedRole = useMemo(() => {
    if (!allow || allow.length === 0) return true;
    const rolesFromMemberships = new Set((payload.memberships ?? []).map(m => m.role));
    if (rolesFromMemberships.size > 0) return allow.some(r => rolesFromMemberships.has(r));
    if (payload.role) return allow.includes(payload.role);
    return true;
  }, [allow, payload]);

  if (!hasAllowedRole) return <Navigate to="/login" replace state={{ from: location }} />;

  if (requireTenant) {
    const tid = getStoredTenantId();
    if (!tid) return <Navigate to="/tenant/select" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
