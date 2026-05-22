import { AuthContext, type AuthContextValue } from '@presentation/auth/auth-context';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { makeAuthUser } from '../../test/fake-auth-repository';
import ProtectedRoute from './ProtectedRoute';

function makeAuthValue(authenticated: boolean): AuthContextValue {
    return {
        user: authenticated ? makeAuthUser() : null,
        isAuthenticated: authenticated,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
    };
}

function renderGuarded(authenticated: boolean) {
    return render(
        <MemoryRouter initialEntries={['/secreto']}>
            <AuthContext.Provider value={makeAuthValue(authenticated)}>
                <Routes>
                    <Route
                        path="/secreto"
                        element={
                            <ProtectedRoute>
                                <div>contenido protegido</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>pantalla de login</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>,
    );
}

describe('ProtectedRoute', () => {
    it('redirige a /login cuando no hay sesion', () => {
        renderGuarded(false);
        expect(screen.getByText('pantalla de login')).toBeInTheDocument();
        expect(screen.queryByText('contenido protegido')).not.toBeInTheDocument();
    });

    it('muestra el contenido cuando hay sesion', () => {
        renderGuarded(true);
        expect(screen.getByText('contenido protegido')).toBeInTheDocument();
        expect(screen.queryByText('pantalla de login')).not.toBeInTheDocument();
    });
});
