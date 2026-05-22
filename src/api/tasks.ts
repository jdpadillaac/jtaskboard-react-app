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
