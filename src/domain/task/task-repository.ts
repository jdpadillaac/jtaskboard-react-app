import type { NewTask, Task, TaskStatus } from './task';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(task: NewTask): Promise<Task>;
  update(id: string, task: NewTask): Promise<Task>;
  updateStatus(id: string, status: TaskStatus): Promise<Task>;
  delete(id: string): Promise<void>;
}