import { httpClient } from '@data/http/http-client';
import type { TaskRepository } from '@domain/task/task-repository';
import type { NewTask, Task } from '@domain/task/task';
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
}