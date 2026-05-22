import { useTasks } from './hooks/useTasks';
import TaskList from './components/TaskList';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import './App.css';

function App() {
  const { tasks, loading, error, refetch } = useTasks();

  return (
    <main className="app">
      <header className="app-header">
        <h1>JTaskboard</h1>
        <p>Listado de tareas</p>
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

export default App;
