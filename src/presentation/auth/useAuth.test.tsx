import { RepositoriesContext } from '@app/repositories-context';
import { AuthError } from '@domain/auth/auth';
import type { AuthRepository } from '@domain/auth/auth-repository';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FakeAuthRepository, makeAuthSession } from '../../test/fake-auth-repository';
import { FakeTaskRepository } from '../../test/fake-task-repository';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

const SESSION_KEY = 'jtaskboard.session';

function makeWrapper(authRepository: AuthRepository) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MemoryRouter>
                <RepositoriesContext.Provider
                    value={{ taskRepository: new FakeTaskRepository(), authRepository }}
                >
                    <AuthProvider>{children}</AuthProvider>
                </RepositoriesContext.Provider>
            </MemoryRouter>
        );
    };
}

describe('useAuth', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('sin sesion guardada arranca sin autenticar', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: makeWrapper(new FakeAuthRepository()),
        });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
    });

    it('inicializa el estado leyendo la sesion de localStorage', () => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(makeAuthSession()));
        const { result } = renderHook(() => useAuth(), {
            wrapper: makeWrapper(new FakeAuthRepository()),
        });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('ada@example.com');
    });

    it('login autentica al usuario y persiste la sesion', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: makeWrapper(new FakeAuthRepository()),
        });

        await act(async () => {
            await result.current.login({ email: 'grace@example.com', password: 'secret123' });
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.email).toBe('grace@example.com');
        expect(localStorage.getItem(SESSION_KEY)).toContain('grace@example.com');
    });

    it('register autentica automaticamente al nuevo usuario', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: makeWrapper(new FakeAuthRepository()),
        });

        await act(async () => {
            await result.current.register({
                firstName: 'Grace',
                lastName: 'Hopper',
                email: 'grace@example.com',
                password: 'secret123',
            });
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user?.firstName).toBe('Grace');
    });

    it('propaga el error si el login falla', async () => {
        const repo = new FakeAuthRepository();
        repo.login.mockRejectedValue(new AuthError(401, 'Credenciales invalidas'));
        const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper(repo) });

        await expect(
            result.current.login({ email: 'ada@example.com', password: 'mala' }),
        ).rejects.toBeInstanceOf(AuthError);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('logout limpia el estado y la sesion guardada', async () => {
        localStorage.setItem(SESSION_KEY, JSON.stringify(makeAuthSession()));
        const { result } = renderHook(() => useAuth(), {
            wrapper: makeWrapper(new FakeAuthRepository()),
        });
        expect(result.current.isAuthenticated).toBe(true);

        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });
});
