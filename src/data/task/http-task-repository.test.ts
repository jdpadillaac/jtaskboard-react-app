import { httpClient } from '@data/http/http-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpTaskRepository } from './http-task-repository';

vi.mock('@data/http/http-client', () => ({
    httpClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

const client = httpClient as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
};

const dto = {
    id: '1',
    taskKey: 'T-1',
    title: 'Titulo',
    description: 'Desc',
    status: 'TODO',
    createdAt: '2024-01-01T00:00:00.000Z',
};

describe('HttpTaskRepository', () => {
    let repo: HttpTaskRepository;

    beforeEach(() => {
        repo = new HttpTaskRepository();
        vi.clearAllMocks();
    });

    describe('getAll', () => {
        it('hace GET /tasks y mapea la respuesta a entidades Task', async () => {
            client.get.mockResolvedValue({ data: [dto] });
            const tasks = await repo.getAll();
            expect(client.get).toHaveBeenCalledWith('/tasks');
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe('1');
            expect(tasks[0].status).toBe('TODO');
        });
    });

    describe('create', () => {
        it('hace POST /tasks con { title, description }', async () => {
            client.post.mockResolvedValue({ data: dto });
            const task = await repo.create({ title: 'Titulo', description: 'Desc' });
            expect(client.post).toHaveBeenCalledWith('/tasks', { title: 'Titulo', description: 'Desc' });
            expect(task.id).toBe('1');
        });
    });

    describe('update', () => {
        it('hace PUT /tasks/:id con los nuevos datos', async () => {
            const updated = { ...dto, title: 'Nuevo titulo' };
            client.put.mockResolvedValue({ data: updated });
            const task = await repo.update('1', { title: 'Nuevo titulo', description: 'Desc' });
            expect(client.put).toHaveBeenCalledWith('/tasks/1', { title: 'Nuevo titulo', description: 'Desc' });
            expect(task.title).toBe('Nuevo titulo');
        });
    });

    describe('updateStatus', () => {
        it('hace PATCH /tasks/:id/status con { status }', async () => {
            client.patch.mockResolvedValue({ data: { ...dto, status: 'DONE' } });
            const task = await repo.updateStatus('1', 'DONE');
            expect(client.patch).toHaveBeenCalledWith('/tasks/1/status', { status: 'DONE' });
            expect(task.status).toBe('DONE');
        });
    });

    describe('delete', () => {
        it('hace DELETE /tasks/:id', async () => {
            client.delete.mockResolvedValue({ data: undefined });
            await repo.delete('1');
            expect(client.delete).toHaveBeenCalledWith('/tasks/1');
        });
    });
});
