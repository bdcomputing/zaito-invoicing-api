import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { queuesRegister } from './config/queues-register.config';
import { queueProcessors } from './processors';

@Global()
@Module({
  imports: [BullModule.registerQueue(...queuesRegister)],
  providers: [...queueProcessors],
  exports: [BullModule.registerQueue(...queuesRegister), ...queueProcessors],
})
export class QueuesModule {}
