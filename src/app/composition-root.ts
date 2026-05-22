import { HttpAuthRepository } from '@data/auth/http-auth-repository';
import { HttpTaskRepository } from '@data/task/http-task-repository';
import type { AuthRepository } from '@domain/auth/auth-repository';
import type { TaskRepository } from '@domain/task/task-repository';

export interface Repositories {
  taskRepository: TaskRepository;
  authRepository: AuthRepository;
}

export const repositories: Repositories = {
  taskRepository: new HttpTaskRepository(),
  authRepository: new HttpAuthRepository(),
};
