import type { Task, TaskStatus } from '@domain/task/task';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConfirmDialog from '@presentation/components/ConfirmDialog';
import EmptyState from '@presentation/components/EmptyState';
import ErrorState from '@presentation/components/ErrorState';
import LoadingState from '@presentation/components/LoadingState';
import TaskList from '@presentation/components/TaskList';
import { useTasks } from '@presentation/hooks/useTasks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const { tasks, loading, error, refetch, deleteTask, updateTaskStatus } = useTasks();

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  async function handleStatusChange(task: Task, status: TaskStatus) {
    try {
      await updateTaskStatus(task.id, status);
    } catch {
      setStatusError('No se pudo cambiar el estado de la tarea.');
    }
  }

  // Auto-cierre del banner de error de estado a los 4 s.
  useEffect(() => {
    if (!statusError) return;
    const id = setTimeout(() => setStatusError(null), 4000);
    return () => clearTimeout(id);
  }, [statusError]);

  function closeDialog() {
    setTaskToDelete(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!taskToDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    } catch {
      setDeleteError('No se pudo eliminar la tarea. Intenta de nuevo.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            JTaskboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Listado de tareas
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/tasks/new')}>
          + Crear tarea
        </Button>
      </Stack>

      <Box>
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && tasks.length === 0 && <EmptyState />}
        {!loading && !error && tasks.length > 0 && (
          <TaskList
            tasks={tasks}
            onEdit={(task) => navigate('/tasks/edit', { state: { task } })}
            onDelete={setTaskToDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </Box>

      <Snackbar
        open={Boolean(statusError)}
        autoHideDuration={4000}
        onClose={() => setStatusError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          action={
            <IconButton size="small" color="inherit" onClick={() => setStatusError(null)} aria-label="Cerrar aviso">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {statusError}
        </Alert>
      </Snackbar>

      {taskToDelete && (
        <ConfirmDialog
          title="Eliminar tarea"
          message={`Seguro que quieres eliminar "${taskToDelete.taskKey}"? Esta accion no se puede deshacer.`}
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
          onCancel={closeDialog}
          loading={deleting}
          error={deleteError}
        />
      )}
    </Container>
  );
}

export default HomePage;
