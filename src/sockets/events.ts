import { TaskInterface } from 'src/task-manager/interfaces/task.interface';

export interface ServerToClientEvents {
  headers: (payload: any) => void;
  newMessage: (payload: { title: string; message: any }) => void;
  tasks: (tasks: TaskInterface[]) => void;
  newTask: (task: TaskInterface) => void;
  taskOverdue: (task: TaskInterface) => void;
  taskReminder: (task: TaskInterface) => void;
  newNotification: (notification: any) => void; // TODO: add notification interface
  newRelease: (notification: {
    message: string;
    api: string;
    appVersion: string;
  }) => void; // TODO: add notification interface
}
