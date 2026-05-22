import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskForm from './TaskForm';

// MDXEditor no funciona en jsdom — se sustituye por un textarea simple.
vi.mock('./MarkdownEditor', () => ({
    default: ({
        onChange,
        initialValue,
    }: {
        onChange: (v: string) => void;
        initialValue: string;
        readOnly?: boolean;
    }) => (
        <textarea
            data-testid="markdown-editor"
            defaultValue={initialValue}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

function renderForm(overrides: Partial<React.ComponentProps<typeof TaskForm>> = {}) {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
        <TaskForm
            submitLabel="Crear"
            submitting={false}
            error={null}
            onSubmit={onSubmit}
            onCancel={onCancel}
            {...overrides}
        />,
    );
    return { onSubmit, onCancel };
}

describe('TaskForm', () => {
    it('deshabilita el boton de envio si el titulo esta vacio', () => {
        renderForm();
        expect(screen.getByRole('button', { name: /crear/i })).toBeDisabled();
    });

    it('llama onSubmit con el titulo al enviar', async () => {
        const { onSubmit } = renderForm();
        await userEvent.type(screen.getByLabelText(/titulo/i), 'Nueva tarea');
        await userEvent.click(screen.getByRole('button', { name: /crear/i }));
        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Nueva tarea' }),
        );
    });

    it('llama onCancel al pulsar Cancelar', async () => {
        const { onCancel } = renderForm();
        await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
        expect(onCancel).toHaveBeenCalled();
    });

    it('muestra el error si se pasa', () => {
        renderForm({ error: 'No se pudo crear la tarea' });
        expect(screen.getByRole('alert')).toHaveTextContent('No se pudo crear la tarea');
    });

    it('deshabilita el formulario mientras submitting=true', () => {
        renderForm({ submitting: true });
        expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    });

    it('precarga el titulo inicial', () => {
        renderForm({ initialTitle: 'Titulo existente' });
        expect(screen.getByLabelText(/titulo/i)).toHaveValue('Titulo existente');
    });
});
