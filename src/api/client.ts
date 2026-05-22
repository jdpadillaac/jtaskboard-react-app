import axios from 'axios';

/**
 * Instancia de axios compartida por toda la app.
 * `baseURL` se toma de la variable de entorno VITE_API_URL:
 *   - desarrollo: `/api/v1` (pasa por el proxy de Vite)
 *   - produccion: URL absoluta del backend
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
