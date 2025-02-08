import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { CreateTaskDto } from 'src/task-manager/dto/create-task.dto';
import { TaskManagerService } from '../services/task-manager.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('task-manager')
export class TaskManagerController {
  /**
   * Creates an instance of TaskManagerController.
   * @param {TaskManagerService} taskManagerService
   * @memberof TaskManagerController
   */
  constructor(private readonly taskManagerService: TaskManagerService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(@Body() payload: CreateTaskDto, @Req() req: any) {
    const userId = req.user._id.toString();
    return await this.taskManagerService.create(payload, userId);
  }

  @Post(':id')
  @UseGuards(AuthenticationGuard)
  async UpdateTaskById(
    @Param('id') id: string,
    @Body() payload: CreateTaskDto,
    @Req() req: any,
  ) {
    const userId = req.user._id.toString();
    return await this.taskManagerService.update(id, payload, userId);
  }

  @Post(':id/mark-as-done')
  @UseGuards(AuthenticationGuard)
  async MarkTaskAsDone(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id.toString();
    return await this.taskManagerService.markTaskAsDone({ id, userId });
  }

  @Post(':id/mark-as-complete')
  @UseGuards(AuthenticationGuard)
  async MarkTaskAsComplete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id.toString();
    return await this.taskManagerService.markTaskAsComplete({ id, userId });
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async getTaskById(@Param('id') id: string) {
    return await this.taskManagerService.findOne(id);
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getTasks(@Query() query: ExpressQuery, @Req() req: any) {
    const currentUser = req.user._id.toString();

    const userId = query.showAll
      ? null
      : query.userId
      ? query.userId
      : currentUser;

    return await this.taskManagerService.findAll({ query, userId });
  }
}
