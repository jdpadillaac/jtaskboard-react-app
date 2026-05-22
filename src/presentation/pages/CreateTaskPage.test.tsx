import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FakeTaskRepository } from '../../test/fake-task-repository';
import { renderWithRepo } from '../../test/render-with-repo';
import CreateTaskPage from './CreateTaskPage';

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

describe('CreateTaskPage', () => {
    it('llama repo.create con el titulo al enviar', async () => {
        const repo = new FakeTaskRepository();
        renderWithRepo(<CreateTaskPage />, repo, { initialEntries: ['/tasks/new'] });

        await userEvent.type(screen.getByLabelText(/titulo/i), 'Tarea nueva');
        await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

        await waitFor(() => expect(repo.create).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Tarea nueva' }),
        ));
    });

    it('muestra error si repo.create falla', async () => {
        const repo = new FakeTaskRepository();
        repo.create.mockRejectedValue(new Error('network'));
        renderWithRepo(<CreateTaskPage />, repo, { initialEntries: ['/tasks/new'] });

        await userEvent.type(screen.getByLabelText(/titulo/i), 'Tarea nueva');
        await userEvent.click(screen.getByRole('button', { name: /crear tarea/i }));

        await waitFor(() =>
            expect(screen.getByRole('alert')).toHaveTextContent(/no se pudo crear/i),
        );
    });
});
