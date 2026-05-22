export interface TaskResponseDto {
  id: string;
  taskKey: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface CreateTaskRequestDto {
  title: string;
  description: string;
}