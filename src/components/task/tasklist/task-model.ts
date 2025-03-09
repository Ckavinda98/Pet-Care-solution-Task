export interface ITask {
  key?: string;
  id: string;
  name: string;
  description: string;
  dueDate: string;
  isTaskCompleted: boolean;
  isDeleted: boolean;
}
