import { httpClient } from '@data/http/http-client';
import {
  AuthError,
  type AuthSession,
  type Credentials,
  type RegisterData,
} from '@domain/auth/auth';
import type { AuthRepository } from '@domain/auth/auth-repository';
import axios from 'axios';
import type { AuthSessionDto } from './auth.dto';
import { toAuthSession, toLoginRequest, toRegisterRequest } from './auth.mapper';

export class HttpAuthRepository implements AuthRepository {
  async register(data: RegisterData): Promise<AuthSession> {
    try {
      const { data: res } = await httpClient.post<AuthSessionDto>(
        '/auth/register',
        toRegisterRequest(data),
      );
      return toAuthSession(res);
    } catch (error) {
      throw toAuthError(error);
    }
  }

  async login(credentials: Credentials): Promise<AuthSession> {
    try {
      const { data: res } = await httpClient.post<AuthSessionDto>(
        '/auth/login',
        toLoginRequest(credentials),
      );
      return toAuthSession(res);
    } catch (error) {
      throw toAuthError(error);
    }
  }
}

// Traduce el error de axios al AuthError del dominio: conserva el codigo
// HTTP (409, 401, 400...) y el mensaje del backend. status 0 = sin
// respuesta (error de red).
function toAuthError(error: unknown): AuthError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as { message?: string } | undefined;
    return new AuthError(status, body?.message ?? error.message);
  }
  return new AuthError(0, 'Error de red');
}
