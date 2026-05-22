import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FakeTaskRepository, makeTask } from '../../test/fake-task-repository';
import { renderWithRepo } from '../../test/render-with-repo';
import EditTaskPage from './EditTaskPage';

// MDXEditor no funciona en jsdom — se sustituye por un textarea simple.
vi.mock('@presentation/components/MarkdownEditor', () => ({
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

const task = makeTask({ title: 'Tarea existente', description: 'Desc' });

describe('EditTaskPage', () => {
    it('redirige a / si no hay state con la tarea', () => {
        const repo = new FakeTaskRepository();
        const { container } = renderWithRepo(<EditTaskPage />, repo, {
            initialEntries: ['/tasks/edit'],
        });
        // Navigate reemplaza el contenido — la pagina de edicion no se muestra
        expect(container.querySelector('form')).not.toBeInTheDocument();
    });

    it('precarga el titulo de la tarea en el formulario', () => {
        const repo = new FakeTaskRepository();
        renderWithRepo(<EditTaskPage />, repo, {
            initialEntries: [{ pathname: '/tasks/edit', state: { task } } as unknown as string],
        });
        expect(screen.getByLabelText(/titulo/i)).toHaveValue('Tarea existente');
    });

    it('llama repo.update al guardar cambios', async () => {
        const repo = new FakeTaskRepository();
        repo.tasks = [task];
        renderWithRepo(<EditTaskPage />, repo, {
            initialEntries: [{ pathname: '/tasks/edit', state: { task } } as unknown as string],
        });

        const titleInput = screen.getByLabelText(/titulo/i);
        await userEvent.clear(titleInput);
        await userEvent.type(titleInput, 'Titulo actualizado');
        await userEvent.click(screen.getByRole('button', { name: /guardar/i }));

        await waitFor(() =>
            expect(repo.update).toHaveBeenCalledWith(
                task.id,
                expect.objectContaining({ title: 'Titulo actualizado' }),
            ),
        );
    });

    it('muestra error si repo.update falla', async () => {
        const repo = new FakeTaskRepository();
        repo.update.mockRejectedValue(new Error('network'));
        renderWithRepo(<EditTaskPage />, repo, {
            initialEntries: [{ pathname: '/tasks/edit', state: { task } } as unknown as string],
        });

        await userEvent.click(screen.getByRole('button', { name: /guardar/i }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/no se pudo guardar/i),
        );
    });
});
