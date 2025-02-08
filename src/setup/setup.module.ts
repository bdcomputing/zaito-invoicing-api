import { Module } from '@nestjs/common';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './services/setup/setup.service';

@Module({
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
