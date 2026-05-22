// Forma de los JSON que intercambia la API de autenticacion.

export interface RegisterRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Respuesta 200/201 comun de /auth/login y /auth/register.
export interface AuthSessionDto {
  accessToken: string;
  tokenType: string;
  user: AuthUserDto;
}
