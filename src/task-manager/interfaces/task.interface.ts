import { User } from 'src/users/interfaces/user.interface';

export interface Task {
  _id: string;
  assignee: string;
  description: string;
  minutesOverdue: number;
  isActive: boolean;
  isSelfTask: boolean;
  overdue: boolean;
  creator?: User;
  deadline: Date | string;
  reminderDate: Date | string;
  assigneeDone: boolean;
  reporterDone: boolean;
  assignedAt?: Date | string;
  createdAt: Date | string;
  createdBy: string;
  updatedAt?: Date | string;
  updatedBy?: string;
}
