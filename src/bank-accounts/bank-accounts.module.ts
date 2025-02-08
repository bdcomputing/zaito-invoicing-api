import { Global, Module } from '@nestjs/common';
import { BankAccountsService } from './services/bank-accounts.service';
import { BankAccountsController } from './controllers/bank-accounts.controller';
import { bankAccountsProviders } from './providers/bank-accounts.provider';

@Global()
@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, ...bankAccountsProviders],
  exports: [BankAccountsService, ...bankAccountsProviders],
})
export class BankAccountsModule {}
