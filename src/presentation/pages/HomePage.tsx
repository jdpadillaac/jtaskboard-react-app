import { Link } from 'react-router-dom';
import { useTasks } from '@presentation/hooks/useTasks';
import TaskList from '@presentation/components/TaskList';
import LoadingState from '@presentation/components/LoadingState';
import ErrorState from '@presentation/components/ErrorState';
import EmptyState from '@presentation/components/EmptyState';

function HomePage() {
  const { tasks, loading, error, refetch } = useTasks();

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
        {!loading && !error && tasks.length > 0 && <TaskList tasks={tasks} />}
      </section>
    </main>
  );
}

export default HomePage;