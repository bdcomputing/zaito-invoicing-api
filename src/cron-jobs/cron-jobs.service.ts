import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronJobsService {
  // private logger = new Logger(CronJobsService.name);
  // @Cron(CronExpression.EVERY_5_SECONDS)
  // openForBusiness() {
  //   this.logger.log('We are running');
  // }
}
