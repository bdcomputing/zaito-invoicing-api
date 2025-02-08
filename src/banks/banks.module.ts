import { Global, Module } from '@nestjs/common';
import { BanksController } from './controllers/banks.controller';
import { BanksService } from './services/banks.service';
import { banksProviders } from './providers/banks.providers';

@Global()
@Module({
  controllers: [BanksController],
  providers: [BanksService, ...banksProviders],
  exports: [BanksService, ...banksProviders],
})
export class BanksModule {
  //
}
