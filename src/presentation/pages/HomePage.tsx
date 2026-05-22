import type { Task } from '@domain/task/task';
import ConfirmDialog from '@presentation/components/ConfirmDialog';
import EmptyState from '@presentation/components/EmptyState';
import ErrorState from '@presentation/components/ErrorState';
import LoadingState from '@presentation/components/LoadingState';
import TaskList from '@presentation/components/TaskList';
import { useTasks } from '@presentation/hooks/useTasks';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const { tasks, loading, error, refetch, deleteTask } = useTasks();

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          <TaskList
            tasks={tasks}
            onEdit={(task) => navigate('/tasks/edit', { state: { task } })}
            onDelete={setTaskToDelete}
          />
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
