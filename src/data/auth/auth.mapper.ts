import type {
  AuthSession,
  AuthUser,
  Credentials,
  RegisterData,
} from '@domain/auth/auth';
import type {
  AuthSessionDto,
  AuthUserDto,
  LoginRequestDto,
  RegisterRequestDto,
} from './auth.dto';

export function toAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    createdAt: dto.createdAt,
  };
}

const FALLBACK_TTL_MS = 60 * 60 * 1000;

function jwtExpiry(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as { exp?: number };
    return typeof claims.exp === 'number' ? claims.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function toAuthSession(dto: AuthSessionDto): AuthSession {
  return {
    accessToken: dto.accessToken,
    tokenType: dto.tokenType,
    expiresAt: jwtExpiry(dto.accessToken) ?? Date.now() + FALLBACK_TTL_MS,
    user: toAuthUser(dto.user),
  };
}

export function toRegisterRequest(data: RegisterData): RegisterRequestDto {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  };
}

export function toLoginRequest(credentials: Credentials): LoginRequestDto {
  return { email: credentials.email, password: credentials.password };
}
