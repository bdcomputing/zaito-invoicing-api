import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { logsProviders } from './providers/logs.provider';

@Global()
@Module({
  controllers: [],
  providers: [LoggerService, ...logsProviders],
  exports: [LoggerService, ...logsProviders],
})
export class LoggerModule {}
