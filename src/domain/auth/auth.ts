// Entidades y reglas del dominio de autenticacion. TS puro, sin React ni
// axios. La capa data implementa el puerto; presentation lo consume.

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Sesion activa: token de acceso + datos del usuario autenticado.
export interface AuthSession {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

// Limites de validacion que exige el backend.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

// Error de autenticacion con el codigo HTTP que lo origino. La data lo
// lanza al traducir errores de axios; la presentacion lo mapea a textos.
// Nota: sin parameter properties (erasableSyntaxOnly del tsconfig).
export class AuthError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}
