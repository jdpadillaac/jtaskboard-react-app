import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import ProtectedRoute from './ProtectedRoute';

// Layout de las rutas autenticadas: aplica la guarda de acceso y, si hay
// sesion, pinta la barra superior + la pagina activa (<Outlet />).
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppHeader />
      <Outlet />
    </ProtectedRoute>
  );
}

export default ProtectedLayout;
