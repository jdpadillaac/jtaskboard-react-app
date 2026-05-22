import { useRepositories } from '@app/useRepositories';
import type { NewTask, Task } from '@domain/task/task';
import TaskForm from '@presentation/components/TaskForm';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

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
        <main className="app">
            <header className="app-header">
                <div>
                    <h1>Editar tarea</h1>
                    <p>
                        <Link to="/" className="back-link">
                            &larr; Volver al listado
                        </Link>
                    </p>
                </div>
                <span className="task-key">{resolvedTask.taskKey}</span>
            </header>

            <section className="app-content">
                <TaskForm
                    initialTitle={resolvedTask.title}
                    initialDescription={resolvedTask.description}
                    submitLabel="Guardar cambios"
                    submitting={submitting}
                    error={error}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/')}
                />
            </section>
        </main>
    );
}

export default EditTaskPage;
