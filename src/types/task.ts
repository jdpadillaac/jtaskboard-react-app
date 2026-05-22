/**
 * Modelo de dominio de una tarea, espejo del `TaskResponse` del backend
 * (ver OpenAPI en https://jtaskboard.onrender.com/swagger-ui/index.html).
 */
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  taskKey: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

/** Etiquetas legibles para cada estado, usadas en la UI. */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completada',
};
