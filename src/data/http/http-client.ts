import axios from 'axios';
import { clearStoredSession, getStoredToken } from './session-storage';

export const httpClient = axios.create({
  // VITE_API_URL puede no existir en build (el .env no se versiona):
  // /api/v1 es el valor correcto en dev (proxy de Vite) y en prod (rewrite).
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Los endpoints de /auth/* son publicos: no deben llevar Authorization
// (un token viejo o expirado no debe interferir con login/registro).
function isPublicAuthUrl(url: string | undefined): boolean {
  return (url ?? '').startsWith('/auth/');
}

// Request: adjunta el token guardado a toda peticion protegida.
httpClient.interceptors.request.use((config) => {
  if (!isPublicAuthUrl(config.url)) {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response: ante un 401 en una peticion protegida (token expirado o
// ausente), limpia la sesion y manda a /login. Las llamadas a /auth/*
// quedan exentas: su 401 lo gestiona la pantalla de login.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !isPublicAuthUrl(error?.config?.url)) {
      clearStoredSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);
