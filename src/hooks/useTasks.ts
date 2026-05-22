import { useCallback, useEffect, useState } from 'react';
import { getTasks } from '../api/tasks';
import type { Task } from '../types/task';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook que carga el listado de tareas desde la API y expone los estados
 * de UI (cargando / error / datos) junto con una funcion `refetch`.
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError('No se pudieron cargar las tareas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial al montar. `fetchTasks` actualiza estado de forma
    // asincrona (loading/error/datos): es el patron estandar de
    // fetch-on-mount para un hook propio sin libreria de data fetching.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}
