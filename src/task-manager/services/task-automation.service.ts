import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UsersService } from '../../users/services/users.service';
import { Queue } from 'bull';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { QueuesEnum } from 'src/queues/enums/queues.enum';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { TaskInterface } from '../interfaces/task.interface';

@Injectable()
export class TaskAutomationService {
  constructor(
    private readonly usersService: UsersService,
    @InjectQueue(QueuesEnum.SEND_EMAIL_ON_TASK_OVERDUE)
    private tasksQueue: Queue,
    @Inject(DatabaseModelEnums.TASKS_MODEL)
    private tasks: Model<TaskInterface>,
    private readonly eventEmmitter: EventEmitter2,
  ) {
    //
  }
  /**
   * Respond to task created or updated
   *
   * @param {TaskInterface} task
   * @memberof TaskAutomationService
   */
  @OnEvent(SystemEventsEnum.TaskCreated, { async: true })
  // @OnEvent(SystemEventsEnum.TaskUpdated, { async: true })
  async respondToTaskCreated(task: TaskInterface) {
    if (task && task.assignee) {
      const assignee = task.assignee;
      const user: UserInterface = await this.usersService.findOne(assignee);
      await this.tasksQueue.add(
        { task, user },
        { removeOnComplete: true, removeOnFail: true },
      );
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateOverdueTasks() {
    const now = new Date(); // get the current time
    const aggregate: Array<any> = [
      {
        $addFields: {
          createdBy: {
            $toObjectId: '$createdBy',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $unwind: '$creator',
      },
      {
        $sort: {
          deadline: 1,
        },
      },
    ];
    const entries: TaskInterface[] = await this.tasks
      .aggregate(aggregate)
      .exec();
    const newEntries = entries.map((entry) => {
      if (entry.isActive && entry.deadline && !entry.reporterDone) {
        const deadline = new Date(entry.deadline);
        // task overdue
        if (now >= deadline) {
          const wasOverdue: boolean = entry.overdue;
          const minutesOverdue = Math.abs(
            Math.floor((deadline.getTime() - now.getTime()) / (60 * 1000)),
          );
          entry.overdue = true;
          entry.minutesOverdue = Math.abs(minutesOverdue);
          // Update notification
          this.tasks
            .findByIdAndUpdate(entry._id, entry, { returnOriginal: false })
            .exec();
          // Check if it was overdue, if not send an overdue notification
          if (!wasOverdue) {
            this.eventEmmitter.emit(SystemEventsEnum.TaskOverdue, entry);
          }
          return entry;
        } else {
          //Tasks pending
          const minutesOverdue = Math.floor(
            (deadline.getTime() - now.getTime()) / (60 * 1000),
          );
          // Update
          entry.overdue = false;
          entry.minutesOverdue = minutesOverdue;
          // Update notification
          this.tasks
            .findByIdAndUpdate(entry._id, entry, { returnOriginal: false })
            .exec();
          return entry;
        }
      }
      return entry;
    });
    this.eventEmmitter.emit(SystemEventsEnum.Tasks, newEntries);
  }
}
