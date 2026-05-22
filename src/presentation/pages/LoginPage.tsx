import { useAuth } from '@presentation/auth/useAuth';
import AuthCard from '@presentation/components/AuthCard';
import { loginErrorMessage } from '@presentation/labels/auth-labels';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Con sesion activa no tiene sentido ver el login.
  if (isAuthenticated) return <Navigate to="/" replace />;

  const isValid = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      navigate('/', { replace: true });
    } catch (err) {
      // Un 401 aqui = credenciales invalidas: el CTA de registro
      // (abajo) guia al usuario sin sesion hacia /register.
      setError(loginErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Iniciar sesion" subtitle="Accede para gestionar tus tareas.">
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <TextField
            id="login-email"
            label="Correo electronico"
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <TextField
            id="login-password"
            label="Contrasena"
            type="password"
            fullWidth
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />

          {error && <Alert severity="error" role="alert">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={!isValid || submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No tienes cuenta?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Crear una cuenta
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}

export default LoginPage;
