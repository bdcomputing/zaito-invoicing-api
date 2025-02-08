import { NewTaskCreatedEmailProcessor } from './new-task-email.processor';
import { NewTaskOverdueEmailProcessor } from './tasks-overdue.processor';

export const tasksProcessors = [
  NewTaskCreatedEmailProcessor,
  NewTaskOverdueEmailProcessor,
];
