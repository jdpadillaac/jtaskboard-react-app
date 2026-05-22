import { useAuth } from '@presentation/auth/useAuth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Guarda de acceso: si no hay sesion, redirige a /login. Envuelve el
// contenido que solo debe verse autenticado.
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default ProtectedRoute;
