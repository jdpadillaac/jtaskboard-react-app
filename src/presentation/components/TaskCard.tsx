import type { Task, TaskStatus } from '@domain/task/task';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatusSelect from './StatusSelect';

interface TaskCardProps {
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

function TaskCard({ task, onOpen, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    return (
        <Card variant="outlined">
            <CardContent
                onClick={() => onOpen(task)}
                sx={{ cursor: 'pointer' }}
            >
                <Stack spacing={1.5}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {task.taskKey}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(task.createdAt)}
                        </Typography>
                    </Stack>

                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {task.title}
                    </Typography>

                    <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <StatusSelect
                            status={task.status}
                            onChange={(status) => onStatusChange(task, status)}
                        />
                        <Box>
                            <IconButton
                                onClick={() => onEdit(task)}
                                aria-label="Editar tarea"
                                title="Editar tarea"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                color="error"
                                onClick={() => onDelete(task)}
                                aria-label="Eliminar tarea"
                                title="Eliminar tarea"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default TaskCard;
