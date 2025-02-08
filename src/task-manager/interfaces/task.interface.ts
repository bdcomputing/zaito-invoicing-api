import { UserInterface } from 'src/users/interfaces/user.interface';

export interface TaskInterface {
  _id: string;
  assignee: string;
  description: string;
  minutesOverdue: number;
  isActive: boolean;
  isSelfTask: boolean;
  overdue: boolean;
  creator?: UserInterface;
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
