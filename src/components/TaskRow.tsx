import type { Task } from '../types/task';
import StatusBadge from './StatusBadge';

interface TaskRowProps {
  task: Task;
}

/** Formatea una fecha ISO a un formato corto legible en espanol. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Una fila de la tabla de tareas. */
function TaskRow({ task }: TaskRowProps) {
  return (
    <tr>
      <td className="task-key">{task.taskKey}</td>
      <td className="task-title">{task.title}</td>
      <td>
        <StatusBadge status={task.status} />
      </td>
      <td className="task-date">{formatDate(task.createdAt)}</td>
    </tr>
  );
}

export default TaskRow;
