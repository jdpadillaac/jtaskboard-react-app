import type { Task } from '@domain/task/task';
import StatusBadge from './StatusBadge';

interface TaskRowProps {
  task: Task;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

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