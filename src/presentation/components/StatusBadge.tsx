import type { TaskStatus } from '@domain/task/task';
import Chip from '@mui/material/Chip';
import { STATUS_LABELS } from '@presentation/labels/task-labels';

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_COLORS: Record<TaskStatus, 'default' | 'warning' | 'success'> = {
  TODO: 'default',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Chip
      label={STATUS_LABELS[status]}
      color={STATUS_COLORS[status]}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}

export default StatusBadge;