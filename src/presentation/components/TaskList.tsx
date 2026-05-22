import type { Task } from '@domain/task/task';
import TaskRow from './TaskRow';

interface TaskListProps {
  tasks: Task[];
  onDelete: (task: Task) => void;
}

function TaskList({ tasks, onDelete }: TaskListProps) {
  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Clave</th>
          <th>Titulo</th>
          <th>Estado</th>
          <th>Creada</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;
