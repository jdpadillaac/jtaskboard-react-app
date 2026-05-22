import type { NewTask, Task } from './task';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(task: NewTask): Promise<Task>;
  update(id: string, task: NewTask): Promise<Task>;
  delete(id: string): Promise<void>;
}