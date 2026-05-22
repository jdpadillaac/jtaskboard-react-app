import type { Task } from '@domain/task/task';
import TaskRow from './TaskRow';

import type { TaskStatus } from '@domain/task/task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
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
          <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
        ))}
      </tbody>
    </table>
  );
}

export default TaskList;
