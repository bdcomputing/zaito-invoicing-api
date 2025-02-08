import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { generateUniqueBatchNumber } from 'src/shared/helpers/generate-unique-batch-no.helper';
import {
  CreateTaskDto,
  PostTaskDto,
  PostUpdatedTaskDto,
} from 'src/task-manager/dto/create-task.dto';
import { TaskInterface } from 'src/task-manager/interfaces/task.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PaginatedDataInterface } from 'src/database/interfaces/paginated-data.interface';
import { UsersService } from 'src/users/services/users.service';
import { ObjectId } from 'mongodb';
import { PrepareAggregateForTasks } from '../helpers/tasks-query.helper';

@Injectable()
export class TaskManagerService {
  private logger = new Logger(TaskManagerService.name);
  constructor(
    @Inject(DatabaseModelEnums.TASKS_MODEL)
    private tasks: Model<TaskInterface>,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {
    //
  }

  async create(
    data: CreateTaskDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const payload: PostTaskDto = data as any;
      payload.createdBy = userId;
      payload.deadline = data.deadline ? new Date(data.deadline) : null;
      payload.reminderDate = data.reminderDate
        ? new Date(data.reminderDate)
        : null;
      payload.batchNo = generateUniqueBatchNumber();
      const task = await this.tasks.create(payload);
      // get task creator
      const creator = await this.usersService.findOne(task.createdBy);
      const taskInstance: TaskInterface = {
        _id: task._id,
        assignee: task.assignee,
        description: task.description,
        minutesOverdue: task.minutesOverdue,
        isActive: task.isActive,
        isSelfTask: task.isSelfTask,
        overdue: task.overdue,
        deadline: task.deadline,
        reminderDate: task.reminderDate,
        assigneeDone: task.assigneeDone,
        reporterDone: task.reporterDone,
        assignedAt: task.assignee ? new Date() : null,
        createdAt: task.createdAt,
        createdBy: task.createdBy,
        creator,
      };
      // emit the event that the task has been created
      this.eventEmitter.emit(SystemEventsEnum.TaskCreated, taskInstance);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        'The new task has been created',
        taskInstance,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async assignTask(data: { taskId: string; assignee: string }) {
    const filter = { _id: new ObjectId(data.taskId) };
    const payload = {};
    const options = { returnOriginal: false };
    try {
      const task = await this.tasks
        .findOneAndUpdate(filter, payload, options)
        .exec();
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Task with id ${data.taskId} has been assigned`,
        task,
      );
    } catch (error) {
      this.logger.error(error);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async update(
    id: string,
    data: CreateTaskDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const task = await this.tasks.findById(id).exec();

      if (!task) {
        throw new Error(`The task with the id${id} does not exist`);
      }

      const payload: PostUpdatedTaskDto = data as any;
      const filter = { _id: id };
      // payload.assignee = payload.isSelfTask ? userId : payload.assignee; // if is self assigned then assignee is current user
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Check if we are updating assignee
      if (data.assignee) {
        if (data.assignee !== userId) {
          payload.isSelfTask = false;
          payload.assignee = data.assignee;
          payload.assignedAt = new Date();
        } else {
          payload.assignee = userId;
          payload.assignedAt = undefined;
          payload.isSelfTask = true;
        }
      }

      // When assigning task to assignee
      if (data.assignee && data.assignee !== userId) {
        payload.assignee = data.assignee;
      } else {
        payload.assignee = userId;
      }

      if (payload.assigneeDone) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'You are not creator of this task hence you can not approve',
          null,
        );
      }
      payload.assigneeDone =
        data.assignee === userId && data.assigneeDone
          ? data.assigneeDone
          : false;

      // Mark as reportedDone when the creator is the current logged in user
      payload.reporterDone =
        task.createdBy === userId && data.reporterDone
          ? data.reporterDone
          : false;

      const updatedTask = await this.tasks
        .findOneAndUpdate(filter, payload, { returnOriginal: false })
        .exec();

      // emit the event that the task has been created
      this.eventEmitter.emit(SystemEventsEnum.TaskUpdated, updatedTask);

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'The task has been updated',
        updatedTask,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
  /**
   *Marks Task as done by the assignee
   *
   * @param {string} userId
   * @memberof TaskManagerService
   */
  async markTaskAsDone(data: { id: string; userId: string }) {
    const { id, userId } = data;
    try {
      const task = await this.tasks.findById(id).exec();
      if (task.assignee !== userId) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'Only assignee can mark task as done',
          null,
        );
      }

      const filter = { _id: id };
      const updatedTask = await this.tasks
        .findOneAndUpdate(
          filter,
          { assigneeDone: true },
          { returnOriginal: false },
        )
        .exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'The task has been marked as done',
        updatedTask,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
  /**
   *Marks Task as complete by the Creator
   *
   * @param {string} userId
   * @memberof TaskManagerService
   */
  async markTaskAsComplete(data: { id: string; userId: string }) {
    const { id, userId } = data;
    try {
      const task = await this.tasks.findById(id).exec();
      if (task.assignee !== userId) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'Only creator can approve task as complete',
          null,
        );
      }
      const filter = { _id: id };
      const updatedTask = await this.tasks
        .findOneAndUpdate(
          filter,
          { reporterDone: true },
          { returnOriginal: false },
        )
        .exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'The task has marked as done',
        updatedTask,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async findOne(id: string): Promise<CustomHttpResponse> {
    try {
      const aggregate = [
        {
          $addFields: {
            id: {
              $toString: '$_id',
            },
          },
        },
        {
          $match: {
            id: id,
          },
        },
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
          $limit: 1,
        },
      ];
      const res = await this.tasks.aggregate(aggregate).exec();
      if (res.length < 1) {
        throw new Error(`The task with the id${id} does not exist`);
      }

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'The task has been loaded from the database',
        res[0],
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async findAll(payload: {
    query: ExpressQuery;
    userId?: string | '';
  }): Promise<CustomHttpResponse> {
    try {
      const query = payload.query;
      const limitQ = query.limit;
      const totalTasks = await this.tasks.find().countDocuments().exec();
      const limit = +limitQ === -1 ? totalTasks : +query.limit || 10;
      const userId = payload.userId ? payload.userId : '';
      const keyword = query && query.keyword ? (query.keyword as string) : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      const date = query.date;
      const pending: boolean | null = query.pending
        ? JSON.parse(query.pending as string)
        : null;
      const overdue: boolean | null = query.overdue
        ? JSON.parse(query.overdue as string)
        : null;
      const completed: boolean | null = query.completed
        ? JSON.parse(query.completed as string)
        : null;
      const sort: any =
        query && query.sort ? { ...(query.sort as any) } : { deadline: 1 };

      const aggregation: Array<any> = PrepareAggregateForTasks({
        clientId: userId,
        keyword,
        skip,
        limit,
        sort,
      });

      if (date) {
        const startDate = new Date(date as string);
        startDate.setHours(0, 0, 0);
        const endDate = new Date(date as string);
        endDate.setHours(23, 59, 59);
        aggregation.splice(1, 0, {
          $match: {
            deadline: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        });
      }
      if (overdue !== null) {
        aggregation.splice(1, 0, {
          $match: {
            overdue: overdue,
          },
        });
      }
      if (completed) {
        aggregation.splice(1, 0, {
          $match: {
            assigneeDone: true,
            reporterDone: true,
          },
        });
      }
      if (pending) {
        aggregation.splice(1, 0, {
          $match: {
            assigneeDone: false,
            reporterDone: false,
            isActive: true,
            overdue: false,
          },
        });
      }

      // get all the tasks
      const tasks: TaskInterface[] = await this.tasks.aggregate(aggregation);

      const counts = await this.tasks.aggregate([
        ...aggregation.slice(0, -2),
        { $count: 'count' },
      ]);

      const total = counts.length > 0 ? counts[0].count : 0;

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedDataInterface = {
        page,
        limit,
        total,
        data: tasks,
        pages,
      };

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Tasks loaded from database successfully!',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
}
