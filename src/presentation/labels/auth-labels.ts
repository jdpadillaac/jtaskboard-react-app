import { AuthError } from '@domain/auth/auth';

// Traduce un error capturado en login/registro a un mensaje para el
// usuario. Centraliza los textos de UI fuera del dominio.

export function loginErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.status === 401) return 'Correo o contrasena incorrectos.';
    if (error.status === 400) return error.message || 'Revisa los datos introducidos.';
    if (error.status === 0) return 'No hay conexion con el servidor. Intenta de nuevo.';
  }
  return 'No se pudo iniciar sesion. Intenta de nuevo.';
}

export function registerErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    if (error.status === 409) return 'Ese correo ya esta registrado.';
    if (error.status === 400) return error.message || 'Revisa los datos introducidos.';
    if (error.status === 0) return 'No hay conexion con el servidor. Intenta de nuevo.';
  }
  return 'No se pudo completar el registro. Intenta de nuevo.';
}

// True si el fallo de login fue por credenciales (401): la pantalla
// resalta entonces el CTA hacia el registro.
export function isUnauthorized(error: unknown): boolean {
  return error instanceof AuthError && error.status === 401;
}
