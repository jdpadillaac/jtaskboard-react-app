import type { Task } from '../types/task';
import TaskRow from './TaskRow';

interface TaskListProps {
  tasks: Task[];
}

/** Tabla con el listado de tareas. */
function TaskList({ tasks }: TaskListProps) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Clave</th>
          <th>Titulo</th>
          <th>Estado</th>
          <th>Creada</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;
