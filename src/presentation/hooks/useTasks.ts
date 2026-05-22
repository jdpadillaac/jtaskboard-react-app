import { useRepositories } from '@app/useRepositories';
import type { Task } from '@domain/task/task';
import { useCallback, useEffect, useState } from 'react';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTasks(): UseTasksResult {
  const { taskRepository } = useRepositories();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskRepository.getAll();
      setTasks(data);
    } catch {
      setError('No se pudieron cargar las tareas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [taskRepository]);

  useEffect(() => {
    // Carga inicial al montar. `fetchTasks` actualiza estado de forma
    // asincrona (loading/error/datos): es el patron estandar de
    // fetch-on-mount para un hook propio sin libreria de data fetching.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}