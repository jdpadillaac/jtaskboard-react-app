import { useRepositories } from '@app/useRepositories';
import type { NewTask } from '@domain/task/task';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import TaskForm from '@presentation/components/TaskForm';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

function CreateTaskPage() {
  const navigate = useNavigate();
  const { taskRepository } = useRepositories();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: NewTask) {
    setSubmitting(true);
    setError(null);
    try {
      await taskRepository.create(input);
      navigate('/');
    } catch {
      setError('No se pudo crear la tarea. Intenta de nuevo.');
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Crear tarea
        </Typography>
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary" variant="body2">
          &larr; Volver al listado
        </Link>
      </Box>

      <TaskForm
        submitLabel="Crear tarea"
        submitting={submitting}
        error={error}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </Container>
  );
}

export default CreateTaskPage;