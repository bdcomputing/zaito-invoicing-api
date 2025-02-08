import { Global, Module } from '@nestjs/common';
import { InvoicesController } from './controllers/invoices.controller';
import { invoicesProviders } from './providers/invoices.providers';
import { InvoiceAutomationService } from './services/invoice-automation.service';
import { InvoiceReportsService } from './services/invoice-reports.service';
import { InvoiceReportsController } from './controllers/invoice-reports.controller';
// import { InvoicePaymentsService } from './services/invoice-payments.service';
import { InvoicesService } from './services/invoices.service';

@Global()
@Module({
  controllers: [InvoicesController, InvoiceReportsController],
  providers: [
    ...invoicesProviders,
    InvoicesService,
    InvoiceAutomationService,
    InvoiceReportsService,
    // InvoicePaymentsService,
  ],
  exports: [
    ...invoicesProviders,
    InvoicesService,
    InvoiceAutomationService,
    InvoiceReportsService,
  ],
})
export class InvoicesModule {}
