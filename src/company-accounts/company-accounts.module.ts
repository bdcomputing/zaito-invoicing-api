import { Module } from '@nestjs/common';
import { companyAccountsProviders } from './providers/company-accounts.provider';
import { CompanyAccountsController } from './controllers/company-accounts.controller';
import { CompanyAccountsService } from 'src/company-accounts/services/company-accounts.service';

@Module({
  controllers: [CompanyAccountsController],
  providers: [...companyAccountsProviders, CompanyAccountsService],
  exports: [...companyAccountsProviders],
})
export class CompanyAccountsModule {}
