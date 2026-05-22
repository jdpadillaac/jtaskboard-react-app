import { Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@domain/task/task';
import StatusBadge from './StatusBadge';

interface TaskRowProps {
  task: Task;
  onDelete: (task: Task) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function TaskRow({ task, onDelete }: TaskRowProps) {
  return (
    <tr>
      <td className="task-key">{task.taskKey}</td>
      <td className="task-title">{task.title}</td>
      <td>
        <StatusBadge status={task.status} />
      </td>
      <td className="task-date">{formatDate(task.createdAt)}</td>
      <td className="task-actions">
        <button
          type="button"
          className="icon-button"
          disabled
          aria-label="Editar tarea"
          title="Edicion no disponible todavia"
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button icon-button--danger"
          onClick={() => onDelete(task)}
          aria-label="Eliminar tarea"
          title="Eliminar tarea"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
