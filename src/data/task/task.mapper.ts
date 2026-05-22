import type { NewTask, Task, TaskStatus } from '@domain/task/task';
import type { CreateTaskRequestDto, TaskResponseDto } from './task.dto';

export function toTask(dto: TaskResponseDto): Task {
  return { ...dto, status: dto.status as TaskStatus };
}

export function toCreateRequest(task: NewTask): CreateTaskRequestDto {
  return { title: task.title, description: task.description };
}