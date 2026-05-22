import { RepositoriesContext } from '@app/repositories-context';
import type { AuthRepository } from '@domain/auth/auth-repository';
import { AuthProvider } from '@presentation/auth/AuthProvider';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FakeAuthRepository } from './fake-auth-repository';
import { FakeTaskRepository } from './fake-task-repository';

interface RenderAuthOptions {
    initialEntries?: string[];
    authRepository?: AuthRepository;
}

// Monta el arbol de proveedores que necesita una pantalla autenticada:
// router + repositorios + AuthProvider.
export function renderWithAuth(
    ui: ReactNode,
    { initialEntries = ['/'], authRepository }: RenderAuthOptions = {},
) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <RepositoriesContext.Provider
                value={{
                    taskRepository: new FakeTaskRepository(),
                    authRepository: authRepository ?? new FakeAuthRepository(),
                }}
            >
                <AuthProvider>{ui}</AuthProvider>
            </RepositoriesContext.Provider>
        </MemoryRouter>,
    );
}
