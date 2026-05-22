import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@domain/auth/auth';
import { useAuth } from '@presentation/auth/useAuth';
import AuthCard from '@presentation/components/AuthCard';
import { registerErrorMessage } from '@presentation/labels/auth-labels';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  // Validacion en cliente alineada con la del backend (400 si falla).
  const passwordTooShort =
    password.length > 0 && password.length < PASSWORD_MIN_LENGTH;
  const passwordTooLong = password.length > PASSWORD_MAX_LENGTH;
  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= PASSWORD_MIN_LENGTH &&
    !passwordTooLong;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      // Registro correcto = usuario logueado: directo al listado.
      navigate('/', { replace: true });
    } catch (err) {
      setError(registerErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthCard title="Crear cuenta" subtitle="Registrate para empezar a gestionar tareas.">
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <TextField
            id="register-first-name"
            label="Nombre"
            fullWidth
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
          />
          <TextField
            id="register-last-name"
            label="Apellidos"
            fullWidth
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={submitting}
          />
          <TextField
            id="register-email"
            label="Correo electronico"
            type="email"
            fullWidth
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <TextField
            id="register-password"
            label="Contrasena"
            type="password"
            fullWidth
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            error={passwordTooShort || passwordTooLong}
            slotProps={{ htmlInput: { maxLength: PASSWORD_MAX_LENGTH } }}
            helperText={
              passwordTooShort
                ? `Minimo ${PASSWORD_MIN_LENGTH} caracteres.`
                : `Entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`
            }
          />

          {error && <Alert severity="error" role="alert">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={!isValid || submitting}>
            {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Iniciar sesion
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}

export default RegisterPage;
