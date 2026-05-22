import type {
  AuthSession,
  AuthUser,
  Credentials,
  RegisterData,
} from '@domain/auth/auth';
import type { AuthRepository } from '@domain/auth/auth-repository';
import { vi } from 'vitest';

export function makeAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'user-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    createdAt: '2026-05-22T10:00:00.000Z',
    ...overrides,
  };
}

export function makeAuthSession(
  overrides: Partial<AuthSession> = {},
): AuthSession {
  return {
    accessToken: 'fake-access-token',
    tokenType: 'Bearer',
    expiresAt: Date.now() + 60 * 60 * 1000,
    user: makeAuthUser(),
    ...overrides,
  };
}

// Doble de AuthRepository para tests, al estilo de FakeTaskRepository.
export class FakeAuthRepository implements AuthRepository {
  register = vi.fn(async (data: RegisterData): Promise<AuthSession> =>
    makeAuthSession({
      user: makeAuthUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }),
    }),
  );

  login = vi.fn(async (credentials: Credentials): Promise<AuthSession> =>
    makeAuthSession({ user: makeAuthUser({ email: credentials.email }) }),
  );
}
