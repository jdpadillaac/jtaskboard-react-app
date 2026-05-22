import { useRepositories } from '@app/useRepositories';
import type { AuthUser, Credentials, RegisterData } from '@domain/auth/auth';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from './auth-context';
import { clearStoredSession, getStoredSession, storeSession } from './session-store';

interface AuthProviderProps {
  children: ReactNode;
}

// Estado de sesion de la app. Se inicializa de forma sincrona desde
// localStorage para que las rutas protegidas no parpadeen hacia /login
// en una recarga con sesion valida.
export function AuthProvider({ children }: AuthProviderProps) {
  const { authRepository } = useRepositories();
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(
    () => getStoredSession()?.user ?? null,
  );

  const login = useCallback(
    async (credentials: Credentials) => {
      const session = await authRepository.login(credentials);
      storeSession(session);
      setUser(session.user);
    },
    [authRepository],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const session = await authRepository.register(data);
      storeSession(session);
      setUser(session.user);
    },
    [authRepository],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
