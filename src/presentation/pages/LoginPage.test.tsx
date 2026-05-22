import { AuthError } from '@domain/auth/auth';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { FakeAuthRepository } from '../../test/fake-auth-repository';
import { renderWithAuth } from '../../test/render-with-auth';
import LoginPage from './LoginPage';

function renderLogin(authRepository?: FakeAuthRepository) {
    return renderWithAuth(
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<div>listado de tareas</div>} />
            <Route path="/register" element={<div>pantalla de registro</div>} />
        </Routes>,
        { initialEntries: ['/login'], authRepository },
    );
}

describe('LoginPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('deshabilita el envio si faltan credenciales', () => {
        renderLogin();
        expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled();
    });

    it('inicia sesion y redirige al listado de tareas', async () => {
        const repo = new FakeAuthRepository();
        renderLogin(repo);

        await userEvent.type(screen.getByLabelText(/correo/i), 'ada@example.com');
        await userEvent.type(screen.getByLabelText(/contrasena/i), 'secret123');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() =>
            expect(screen.getByText('listado de tareas')).toBeInTheDocument(),
        );
        expect(repo.login).toHaveBeenCalledWith({
            email: 'ada@example.com',
            password: 'secret123',
        });
    });

    it('muestra "correo o contrasena incorrectos" ante un 401', async () => {
        const repo = new FakeAuthRepository();
        repo.login.mockRejectedValue(new AuthError(401, 'Credenciales invalidas'));
        renderLogin(repo);

        await userEvent.type(screen.getByLabelText(/correo/i), 'ada@example.com');
        await userEvent.type(screen.getByLabelText(/contrasena/i), 'mala');
        await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/incorrectos/i),
        );
    });

    it('ofrece un enlace hacia el registro', () => {
        renderLogin();
        expect(screen.getByRole('link', { name: /crear una cuenta/i })).toHaveAttribute(
            'href',
            '/register',
        );
    });
});
