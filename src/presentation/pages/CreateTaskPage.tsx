import { useRepositories } from '@app/useRepositories';
import type { NewTask } from '@domain/task/task';
import TaskForm from '@presentation/components/TaskForm';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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