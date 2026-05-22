import type { AuthUser, Credentials, RegisterData } from '@domain/auth/auth';
import { createContext } from 'react';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// null = sin Provider. useAuth() lo detecta y lanza un error claro.
export const AuthContext = createContext<AuthContextValue | null>(null);
