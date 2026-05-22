import type { Task, TaskStatus } from '@domain/task/task';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import StatusSelect from './StatusSelect';

interface TaskRowProps {
  task: Task;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function TaskRow({ task, onOpen, onEdit, onDelete, onStatusChange }: TaskRowProps) {
  return (
    <TableRow
      hover
      onClick={() => onOpen(task)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>
        <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
          {task.taskKey}
        </Typography>
      </TableCell>
      <TableCell>{task.title}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <StatusSelect
          status={task.status}
          onChange={(status) => onStatusChange(task, status)}
        />
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {formatDate(task.createdAt)}
        </Typography>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <IconButton
          size="small"
          onClick={() => onEdit(task)}
          aria-label="Editar tarea"
          title="Editar tarea"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(task)}
          aria-label="Eliminar tarea"
          title="Eliminar tarea"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default TaskRow;
