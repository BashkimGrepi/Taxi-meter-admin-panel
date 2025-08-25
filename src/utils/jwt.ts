import { JwtPayload } from '../types/schema';

function base64UrlDecode(input: string): string {
  // Replace URL-safe chars and add padding if needed
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  try {
    return decodeURIComponent(
      atob(input)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch {
    return '';
  }
}

export function decodeJwt<T = unknown>(token: string): T | null {
  if (!token || token.split('.').length !== 3) return null;
  const payload = token.split('.')[1];
  const json = base64UrlDecode(payload);
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getJwtPayload(token: string | null): JwtPayload | null {
  if (!token) return null;
  return decodeJwt<JwtPayload>(token);
}

export function isTokenExpired(token: string | null): boolean {
  const payload = getJwtPayload(token);
  if (!payload?.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  // Consider expired if within 30s of exp to avoid races
  return nowSec >= payload.exp - 30;
}

export function hasExp(p: JwtPayload | null): p is JwtPayload & { exp: number } {
  return !!p && typeof p.exp === 'number' && Number.isFinite(p.exp);
}
