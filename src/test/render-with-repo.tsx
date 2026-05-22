import { RepositoriesContext } from '@app/repositories-context';
import type { TaskRepository } from '@domain/task/task-repository';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

export function renderWithRepo(
    ui: ReactNode,
    repo: TaskRepository,
    { initialEntries = ['/'] }: { initialEntries?: string[] } = {},
) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <RepositoriesContext.Provider value={{ taskRepository: repo }}>
                {ui}
            </RepositoriesContext.Provider>
        </MemoryRouter>,
    );
}
