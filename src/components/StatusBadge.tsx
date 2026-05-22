import { STATUS_LABELS, type TaskStatus } from '../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

/** Etiqueta de color que representa el estado de una tarea. */
function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default StatusBadge;
