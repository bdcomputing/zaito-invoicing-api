import { Task } from 'src/task-manager/interfaces/task.interface';

export interface ServerToClientEvents {
  headers: (payload: any) => void;
  newMessage: (payload: { title: string; message: any }) => void;
  tasks: (tasks: Task[]) => void;
  newTask: (task: Task) => void;
  taskOverdue: (task: Task) => void;
  taskReminder: (task: Task) => void;
  newNotification: (notification: any) => void; // TODO: add notification interface
  newRelease: (notification: {
    message: string;
    api: string;
    appVersion: string;
  }) => void; // TODO: add notification interface
}
