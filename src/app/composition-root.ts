import { HttpTaskRepository } from '@data/task/http-task-repository';
import type { TaskRepository } from '@domain/task/task-repository';

export interface Repositories {
  taskRepository: TaskRepository;
}

export const repositories: Repositories = {
  taskRepository: new HttpTaskRepository(),
};