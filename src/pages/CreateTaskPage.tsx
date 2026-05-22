import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { createTask, type CreateTaskInput } from '../api/tasks';

/** Pagina de creacion de una tarea. */
function CreateTaskPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(input: CreateTaskInput) {
    setSubmitting(true);
    setError(null);
    try {
      await createTask(input);
      // Vuelve al listado; HomePage recarga las tareas al montarse.
      navigate('/');
    } catch {
      setError('No se pudo crear la tarea. Intenta de nuevo.');
      setSubmitting(false);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1>Crear tarea</h1>
          <p>
            <Link to="/" className="back-link">
              &larr; Volver al listado
            </Link>
          </p>
        </div>
      </header>

      <section className="app-content">
        <TaskForm
          submitLabel="Crear tarea"
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
        />
      </section>
    </main>
  );
}

export default CreateTaskPage;
