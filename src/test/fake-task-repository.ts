import type { NewTask, Task, TaskStatus } from '@domain/task/task';
import type { TaskRepository } from '@domain/task/task-repository';
import { vi } from 'vitest';

export function makeTask(overrides: Partial<Task> = {}): Task {
    return {
        id: 'task-1',
        taskKey: 'TASK-1',
        title: 'Tarea de prueba',
        description: 'Descripcion de prueba',
        status: 'TODO',
        createdAt: '2024-01-01T00:00:00.000Z',
        ...overrides,
    };
}

export class FakeTaskRepository implements TaskRepository {
    tasks: Task[] = [];

    getAll = vi.fn(async (): Promise<Task[]> => [...this.tasks]);

    create = vi.fn(async (task: NewTask): Promise<Task> => {
        const newTask = makeTask({
            id: crypto.randomUUID(),
            title: task.title,
            description: task.description,
        });
        this.tasks.push(newTask);
        return newTask;
    });

    update = vi.fn(async (id: string, task: NewTask): Promise<Task> => {
        const idx = this.tasks.findIndex((t) => t.id === id);
        const updated = { ...this.tasks[idx], ...task };
        this.tasks[idx] = updated;
        return updated;
    });

    updateStatus = vi.fn(async (id: string, status: TaskStatus): Promise<Task> => {
        const idx = this.tasks.findIndex((t) => t.id === id);
        const updated = { ...this.tasks[idx], status };
        this.tasks[idx] = updated;
        return updated;
    });

    delete = vi.fn(async (id: string): Promise<void> => {
        this.tasks = this.tasks.filter((t) => t.id !== id);
    });
}
