import { isSessionExpired, type AuthSession } from '@domain/auth/auth';

// Persistencia de la sesion en localStorage para la capa de presentacion.
//
// localStorage es una API del navegador, no la capa @data: usarla aqui es
// legitimo. La clave debe coincidir con la de data/http/session-storage.ts
// (el interceptor HTTP lee el token de ahi). presentation no puede importar
// @data, por eso el literal se repite de forma consciente: si cambia aqui,
// cambialo tambien alli.
const SESSION_KEY = 'jtaskboard.session';

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    return isSessionExpired(session) ? null : session;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
