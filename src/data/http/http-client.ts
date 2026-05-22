import axios from 'axios';

export const httpClient = axios.create({
  // VITE_API_URL puede no existir en build (el .env no se versiona):
  // /api/v1 es el valor correcto en dev (proxy de Vite) y en prod (rewrite).
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});