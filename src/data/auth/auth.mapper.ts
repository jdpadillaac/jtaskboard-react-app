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

export function toAuthSession(dto: AuthSessionDto): AuthSession {
  return {
    accessToken: dto.accessToken,
    tokenType: dto.tokenType,
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
