import type { AuthSession } from '@domain/auth/auth';

// Persistencia de la sesion en localStorage.
//
// Esta clave se comparte con presentation/auth/session-store.ts: la
// presentacion no puede importar @data (frontera de capas vigilada por
// ESLint), asi que el literal se repite alli de forma consciente. Si
// cambia aqui, cambialo tambien alli.
const SESSION_KEY = 'jtaskboard.session';

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    // JSON corrupto: lo tratamos como ausencia de sesion.
    return null;
  }
}

export function getStoredToken(): string | null {
  return getStoredSession()?.accessToken ?? null;
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
