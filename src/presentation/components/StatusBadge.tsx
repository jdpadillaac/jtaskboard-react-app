import type { TaskStatus } from '@domain/task/task';
import { STATUS_LABELS } from '@presentation/labels/task-labels';

interface StatusBadgeProps {
  status: TaskStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export default StatusBadge;