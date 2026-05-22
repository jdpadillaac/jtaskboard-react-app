import { RepositoriesContext } from '@app/repositories-context';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { act } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { FakeTaskRepository, makeTask } from '../../test/fake-task-repository';
import { useTasks } from './useTasks';

function makeWrapper(repo: FakeTaskRepository) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <RepositoriesContext.Provider value={{ taskRepository: repo }}>
                {children}
            </RepositoriesContext.Provider>
        );
    };
}

describe('useTasks', () => {
    let repo: FakeTaskRepository;

    beforeEach(() => {
        repo = new FakeTaskRepository();
        repo.tasks = [makeTask()];
    });

    it('carga las tareas al montar (loading → datos)', async () => {
        const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(repo) });
        expect(result.current.loading).toBe(true);
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.tasks).toHaveLength(1);
        expect(result.current.error).toBeNull();
    });

    it('expone error si getAll falla', async () => {
        repo.getAll.mockRejectedValue(new Error('network'));
        const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(repo) });
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.error).toBeTruthy();
        expect(result.current.tasks).toHaveLength(0);
    });

    it('deleteTask elimina la tarea y recarga la lista', async () => {
        const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(repo) });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.deleteTask('task-1');
        });

        expect(repo.delete).toHaveBeenCalledWith('task-1');
        expect(repo.getAll).toHaveBeenCalledTimes(2); // carga inicial + post-borrado
    });

    it('updateTaskStatus aplica el cambio de forma optimista', async () => {
        const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(repo) });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.updateTaskStatus('task-1', 'DONE');
        });

        expect(result.current.tasks[0].status).toBe('DONE');
    });

    it('updateTaskStatus revierte el cambio si el repo falla', async () => {
        repo.updateStatus.mockRejectedValue(new Error('network'));
        const { result } = renderHook(() => useTasks(), { wrapper: makeWrapper(repo) });
        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.updateTaskStatus('task-1', 'DONE').catch(() => null);
        });

        expect(result.current.tasks[0].status).toBe('TODO'); // revertido al estado original
    });
});
