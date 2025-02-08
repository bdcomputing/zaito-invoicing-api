import { OnEvent } from '@nestjs/event-emitter';
import { AppWebSocketGateway } from '../gateway.ws';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { TaskInterface } from 'src/task-manager/interfaces/task.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueuesEnum } from 'src/queues/enums/queues.enum';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/services/users.service';

export class TasksGateway extends AppWebSocketGateway {
  /**
   *
   */
  constructor(
    @InjectQueue(QueuesEnum.SEND_EMAIL_ON_TASK_CREATED)
    private tasksQueue: Queue,
    private readonly usersService: UsersService,
  ) {
    super();
  }
  /**
   * Broadcast tasks back to the client on task creation
   *
   * @param {TaskInterface} task
   * @memberof TasksGateway
   */
  @OnEvent(SystemEventsEnum.TaskCreated, { async: true })
  async sendNewTask(task: TaskInterface) {
    this.server.emit('newTask', task);
  }

  @OnEvent(SystemEventsEnum.Tasks, { async: true })
  async broadcastTasks(tasks: TaskInterface[]) {
    this.server.emit('tasks', tasks);
  }

  @OnEvent(SystemEventsEnum.TaskOverdue, { async: true })
  async sendTaskOverdue(task: TaskInterface) {
    const user: UserInterface = await this.usersService.findOne(task.assignee);
    if (task.assignee) {
      this.tasksQueue.add(
        { task, user },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
    this.server.emit('taskOverdue', task);
  }
  @OnEvent(SystemEventsEnum.TaskReminder, { async: true })
  async sendTaskReminder(task: TaskInterface) {
    this.server.emit('taskReminder', task);
  }

  @OnEvent(SystemEventsEnum.NotificationCreated, { async: true })
  async sendNotification(notification: any) {
    // TODO: Save notification to the database
    this.server.emit('newNotification', notification);
  }
}
