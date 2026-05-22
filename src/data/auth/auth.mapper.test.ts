import { describe, expect, it } from 'vitest';
import type { AuthSessionDto } from './auth.dto';
import { toAuthSession, toLoginRequest, toRegisterRequest } from './auth.mapper';

const dto: AuthSessionDto = {
    accessToken: 'token-abc',
    tokenType: 'Bearer',
    user: {
        id: 'u1',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        createdAt: '2026-05-22T10:00:00.000Z',
    },
};

describe('toAuthSession', () => {
    it('mapea el DTO de sesion al modelo de dominio', () => {
        const session = toAuthSession(dto);
        expect(session.accessToken).toBe('token-abc');
        expect(session.tokenType).toBe('Bearer');
        expect(session.user.id).toBe('u1');
        expect(session.user.email).toBe('ada@example.com');
    });

    it('mapea todos los campos del usuario', () => {
        const { user } = toAuthSession(dto);
        expect(user).toEqual({
            id: 'u1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            createdAt: '2026-05-22T10:00:00.000Z',
        });
    });
});

describe('toRegisterRequest', () => {
    it('crea el DTO de registro con los cuatro campos', () => {
        const req = toRegisterRequest({
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            password: 'secret123',
        });
        expect(req).toEqual({
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            password: 'secret123',
        });
    });
});

describe('toLoginRequest', () => {
    it('crea el DTO de login con email y password', () => {
        const req = toLoginRequest({ email: 'ada@example.com', password: 'secret123' });
        expect(req).toEqual({ email: 'ada@example.com', password: 'secret123' });
    });
});
