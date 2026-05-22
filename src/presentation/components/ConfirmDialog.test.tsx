import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

const defaultProps = {
    title: 'Eliminar tarea',
    message: '¿Seguro que quieres eliminar esta tarea?',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
};

describe('ConfirmDialog', () => {
    it('muestra el titulo y el mensaje', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText('Eliminar tarea')).toBeInTheDocument();
        expect(screen.getByText(/seguro/i)).toBeInTheDocument();
    });

    it('llama onConfirm al pulsar el boton de confirmar', async () => {
        const onConfirm = vi.fn();
        render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
        await userEvent.click(screen.getByRole('button', { name: /eliminar/i }));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('llama onCancel al pulsar Cancelar', async () => {
        const onCancel = vi.fn();
        render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
        await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(onCancel).toHaveBeenCalled();
    });

    it('muestra el error si se pasa', () => {
        render(<ConfirmDialog {...defaultProps} error="No se pudo eliminar" />);
        expect(screen.getByRole('alert')).toHaveTextContent('No se pudo eliminar');
    });

    it('deshabilita los botones mientras loading=true', () => {
        render(<ConfirmDialog {...defaultProps} loading />);
        expect(screen.getByRole('button', { name: /eliminando/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
    });
});
