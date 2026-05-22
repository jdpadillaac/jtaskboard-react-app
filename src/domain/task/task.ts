export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  taskKey: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

export interface NewTask {
  title: string;
  description: string;
}

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 32767;

// Orden del flujo de trabajo. Lo consume la UI para pintar el menu.
export const TASK_STATUSES: readonly TaskStatus[] = [
  'TODO',
  'IN_PROGRESS',
  'DONE',
];