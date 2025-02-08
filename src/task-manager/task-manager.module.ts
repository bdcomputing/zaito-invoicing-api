import { TaskAutomationService } from './services/task-automation.service';
import { Global, Module } from '@nestjs/common';
import { TaskManagerService } from './services/task-manager.service';
import { TaskManagerController } from './controllers/task-manager.controller';
import { taskManagerProviders } from './providers/task-manager.providers';

@Global()
@Module({
  controllers: [TaskManagerController],
  providers: [
    ...taskManagerProviders,
    TaskManagerService,
    TaskAutomationService,
  ],
})
export class TaskManagerModule {}
