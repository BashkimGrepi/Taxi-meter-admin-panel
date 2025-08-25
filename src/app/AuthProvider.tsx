// src/app/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { JwtPayload, Membership, User } from '../types/schema';
import { getJwtPayload, isTokenExpired, hasExp } from '../utils/jwt';
import { getStoredToken, setStoredToken, setStoredTenantId } from '../services/AxiosInstance';
import { notify } from './ToastBoundary';

type AuthContextValue = {
  token: string | null;
  payload: JwtPayload | null;
  user: User | null;
  memberships: Membership[];
  setToken: (token: string | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(null);

  const payload = useMemo(() => getJwtPayload(token), [token]);
  const memberships = payload?.memberships ?? [];

  function setToken(t: string | null) {
    setTokenState(t);
    setStoredToken(t);
  }

  function logout() {
    setToken(null);
    setUser(null);
    notify.info('Logged out');
  }

  // Auto logout when token expires (type-safe with hasExp)
  useEffect(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      logout();
      return;
    }

    const p = getJwtPayload(token);
    if (!hasExp(p)) {
      logout();
      return;
    }

    const msLeft = (p.exp * 1000) - Date.now();
    const id = window.setTimeout(() => logout(), Math.max(1000, msLeft));
    return () => window.clearTimeout(id);
  }, [token]);

  // Persist tenantId from the JWT so axios/guards can use it
  useEffect(() => {
    if (!token) {
      setStoredTenantId(null);
      return;
    }
    const p = getJwtPayload(token);
    if (p?.tenantId) setStoredTenantId(p.tenantId);
  }, [token]);

  const value: AuthContextValue = {
    token,
    payload,
    user,
    memberships,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
