import { useAuth } from '@presentation/auth/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

// Barra superior de la app autenticada: marca, usuario logueado y logout.
function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', flexGrow: 1 }}
        >
          JTaskboard
        </Typography>

        {user && (
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" color="text.secondary">
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        )}

        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          Cerrar sesion
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
