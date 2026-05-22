import { describe, expect, it } from 'vitest';
import type { TaskResponseDto } from './task.dto';
import { toCreateRequest, toTask } from './task.mapper';

const dto: TaskResponseDto = {
    id: '1',
    taskKey: 'T-1',
    title: 'Titulo',
    description: 'Descripcion',
    status: 'TODO',
    createdAt: '2024-01-01T00:00:00.000Z',
};

describe('toTask', () => {
    it('mapea el DTO a una entidad Task', () => {
        const task = toTask(dto);
        expect(task).toEqual({ ...dto, status: 'TODO' });
    });

    it('preserva el status como TaskStatus', () => {
        const task = toTask({ ...dto, status: 'IN_PROGRESS' });
        expect(task.status).toBe('IN_PROGRESS');
    });

    it('preserva todos los campos del DTO', () => {
        const task = toTask(dto);
        expect(task.id).toBe('1');
        expect(task.taskKey).toBe('T-1');
        expect(task.title).toBe('Titulo');
        expect(task.description).toBe('Descripcion');
        expect(task.createdAt).toBe('2024-01-01T00:00:00.000Z');
    });
});

describe('toCreateRequest', () => {
    it('crea el DTO de peticion con title y description', () => {
        const req = toCreateRequest({ title: 'T', description: 'D' });
        expect(req).toEqual({ title: 'T', description: 'D' });
    });

    it('no incluye campos extra', () => {
        const req = toCreateRequest({ title: 'T', description: 'D' });
        expect(Object.keys(req)).toHaveLength(2);
    });
});
