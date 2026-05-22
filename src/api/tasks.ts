import { apiClient } from './client';
import type { Task } from '../types/task';

/**
 * Obtiene el listado completo de tareas.
 * GET /tasks -> Task[]
 */
export async function getTasks(): Promise<Task[]> {
  const { data } = await apiClient.get<Task[]>('/tasks');
  return data;
}

/** Datos necesarios para crear una tarea (espejo de CreateTaskRequest). */
export interface CreateTaskInput {
  title: string;
  description: string;
}

/**
 * Crea una nueva tarea.
 * POST /tasks -> Task
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await apiClient.post<Task>('/tasks', input);
  return data;
}
