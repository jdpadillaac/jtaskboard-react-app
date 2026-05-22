import { httpClient } from '@data/http/http-client';
import type { NewTask, Task } from '@domain/task/task';
import type { TaskRepository } from '@domain/task/task-repository';
import type { TaskResponseDto } from './task.dto';
import { toCreateRequest, toTask } from './task.mapper';

export class HttpTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const { data } = await httpClient.get<TaskResponseDto[]>('/tasks');
    return data.map(toTask);
  }

  async create(task: NewTask): Promise<Task> {
    const { data } = await httpClient.post<TaskResponseDto>(
      '/tasks',
      toCreateRequest(task),
    );
    return toTask(data);
  }

  async update(id: string, task: NewTask): Promise<Task> {
    const { data } = await httpClient.put<TaskResponseDto>(
      `/tasks/${id}`,
      toCreateRequest(task),
    );
    return toTask(data);
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/tasks/${id}`);
  }
}