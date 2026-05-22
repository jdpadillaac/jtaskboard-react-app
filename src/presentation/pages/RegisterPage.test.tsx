import { AuthError } from '@domain/auth/auth';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { FakeAuthRepository } from '../../test/fake-auth-repository';
import { renderWithAuth } from '../../test/render-with-auth';
import RegisterPage from './RegisterPage';

function renderRegister(authRepository?: FakeAuthRepository) {
    return renderWithAuth(
        <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<div>listado de tareas</div>} />
            <Route path="/login" element={<div>pantalla de login</div>} />
        </Routes>,
        { initialEntries: ['/register'], authRepository },
    );
}

async function fillForm(password: string) {
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Ada');
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Lovelace');
    await userEvent.type(screen.getByLabelText(/correo/i), 'ada@example.com');
    await userEvent.type(screen.getByLabelText(/contrasena/i), password);
}

describe('RegisterPage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('mantiene el envio deshabilitado con una contrasena demasiado corta', async () => {
        renderRegister();
        await fillForm('corta');
        expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeDisabled();
    });

    it('registra al usuario y redirige al listado de tareas', async () => {
        const repo = new FakeAuthRepository();
        renderRegister(repo);

        await fillForm('secret123');
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

        await waitFor(() =>
            expect(screen.getByText('listado de tareas')).toBeInTheDocument(),
        );
        expect(repo.register).toHaveBeenCalledWith({
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            password: 'secret123',
        });
    });

    it('muestra "ese correo ya esta registrado" ante un 409', async () => {
        const repo = new FakeAuthRepository();
        repo.register.mockRejectedValue(new AuthError(409, 'Email ya registrado'));
        renderRegister(repo);

        await fillForm('secret123');
        await userEvent.click(screen.getByRole('button', { name: /crear cuenta/i }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/ya esta registrado/i),
        );
    });
});
