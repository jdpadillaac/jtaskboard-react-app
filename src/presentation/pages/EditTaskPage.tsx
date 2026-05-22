import { useRepositories } from '@app/useRepositories';
import type { NewTask, Task } from '@domain/task/task';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TaskForm from '@presentation/components/TaskForm';
import { useState } from 'react';
import { Navigate, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function EditTaskPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { taskRepository } = useRepositories();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // La tarea viaja por router state desde el listado. Si no esta
    // (recarga, URL directa), no hay forma de recuperarla -> al listado.
    const task = (location.state as { task?: Task } | null)?.task;
    if (!task) return <Navigate to="/" replace />;

    const resolvedTask: Task = task;

    async function handleSubmit(input: NewTask) {
        setSubmitting(true);
        setError(null);
        try {
            await taskRepository.update(resolvedTask.id, input);
            navigate('/');
        } catch {
            setError('No se pudo guardar la tarea. Intenta de nuevo.');
            setSubmitting(false);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                        Editar tarea
                    </Typography>
                    <Link component={RouterLink} to="/" underline="hover" color="text.secondary" variant="body2">
                        &larr; Volver al listado
                    </Link>
                </Box>
                <Chip
                    label={resolvedTask.taskKey}
                    variant="outlined"
                    color="primary"
                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                />
            </Stack>

            <TaskForm
                initialTitle={resolvedTask.title}
                initialDescription={resolvedTask.description}
                submitLabel="Guardar cambios"
                submitting={submitting}
                error={error}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/')}
            />
        </Container>
    );
}

export default EditTaskPage;
