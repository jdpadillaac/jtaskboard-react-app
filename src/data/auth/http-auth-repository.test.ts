import { httpClient } from '@data/http/http-client';
import { AuthError } from '@domain/auth/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpAuthRepository } from './http-auth-repository';

vi.mock('@data/http/http-client', () => ({
    httpClient: { post: vi.fn() },
}));

const client = httpClient as unknown as { post: ReturnType<typeof vi.fn> };

const sessionDto = {
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

// Error con la forma que reconoce axios.isAxiosError.
function axiosError(status: number, message: string) {
    return Object.assign(new Error('Request failed'), {
        isAxiosError: true,
        response: { status, data: { message } },
    });
}

describe('HttpAuthRepository', () => {
    let repo: HttpAuthRepository;

    beforeEach(() => {
        repo = new HttpAuthRepository();
        vi.clearAllMocks();
    });

    describe('register', () => {
        it('hace POST /auth/register y mapea la sesion', async () => {
            client.post.mockResolvedValue({ data: sessionDto });
            const session = await repo.register({
                firstName: 'Ada',
                lastName: 'Lovelace',
                email: 'ada@example.com',
                password: 'secret123',
            });
            expect(client.post).toHaveBeenCalledWith('/auth/register', {
                firstName: 'Ada',
                lastName: 'Lovelace',
                email: 'ada@example.com',
                password: 'secret123',
            });
            expect(session.accessToken).toBe('token-abc');
            expect(session.user.email).toBe('ada@example.com');
        });

        it('lanza AuthError con status 409 si el correo ya existe', async () => {
            client.post.mockRejectedValue(axiosError(409, 'Email ya registrado'));
            await expect(
                repo.register({
                    firstName: 'Ada',
                    lastName: 'Lovelace',
                    email: 'ada@example.com',
                    password: 'secret123',
                }),
            ).rejects.toMatchObject({ status: 409 });
        });
    });

    describe('login', () => {
        it('hace POST /auth/login y mapea la sesion', async () => {
            client.post.mockResolvedValue({ data: sessionDto });
            const session = await repo.login({
                email: 'ada@example.com',
                password: 'secret123',
            });
            expect(client.post).toHaveBeenCalledWith('/auth/login', {
                email: 'ada@example.com',
                password: 'secret123',
            });
            expect(session.user.id).toBe('u1');
        });

        it('lanza AuthError con status 401 si las credenciales fallan', async () => {
            client.post.mockRejectedValue(axiosError(401, 'Credenciales invalidas'));
            await expect(
                repo.login({ email: 'ada@example.com', password: 'mala' }),
            ).rejects.toBeInstanceOf(AuthError);
        });

        it('lanza AuthError con status 0 ante un error de red', async () => {
            client.post.mockRejectedValue(new Error('Network Error'));
            await expect(
                repo.login({ email: 'ada@example.com', password: 'secret123' }),
            ).rejects.toMatchObject({ status: 0 });
        });
    });
});
