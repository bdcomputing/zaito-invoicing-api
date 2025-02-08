import { Global, Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';

@Global()
@Module({
  providers: [CronJobsService],
  exports: [CronJobsService],
})
export class CronJobsModule {}
