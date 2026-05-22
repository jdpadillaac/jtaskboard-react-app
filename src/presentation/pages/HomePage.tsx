import type { Task, TaskStatus } from '@domain/task/task';
import ConfirmDialog from '@presentation/components/ConfirmDialog';
import EmptyState from '@presentation/components/EmptyState';
import ErrorState from '@presentation/components/ErrorState';
import LoadingState from '@presentation/components/LoadingState';
import TaskList from '@presentation/components/TaskList';
import { useTasks } from '@presentation/hooks/useTasks';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <main className="app">
      <header className="app-header">
        <div>
          <h1>JTaskboard</h1>
          <p>Listado de tareas</p>
        </div>
        <Link to="/tasks/new" className="button button--primary">
          + Crear tarea
        </Link>
      </header>

      <section className="app-content">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && tasks.length === 0 && <EmptyState />}
        {!loading && !error && tasks.length > 0 && (
          <>
            {statusError && (
              <div className="banner banner--error" role="alert">
                {statusError}
                <button
                  type="button"
                  className="banner-close"
                  onClick={() => setStatusError(null)}
                  aria-label="Cerrar aviso"
                >
                  ✕
                </button>
              </div>
            )}
            <TaskList
              tasks={tasks}
              onEdit={(task) => navigate('/tasks/edit', { state: { task } })}
              onDelete={setTaskToDelete}
              onStatusChange={handleStatusChange}
            />
          </>
        )}
      </section>

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
    </main>
  );
}

export default HomePage;
