import { InvoiceReportsService } from '../services/invoice-reports.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { InvoicesService } from '../services/invoices.service';

@Controller('invoice-reports')
export class InvoiceReportsController {
  /**
   * Creates an instance of InvoiceReportsController.
   * @param {InvoiceReportsService} invoiceReportsService
   * @memberof InvoiceReportsController
   */
  constructor(
    private readonly invoiceReportsService: InvoiceReportsService,
    private readonly invoicesService: InvoicesService,
  ) {
    //
  }

  @Get('latest')
  // TODO: Add the relevant permissions
  async getLatestClientReports(@Query('limit') limit: number) {
    return await this.invoiceReportsService.getLatestInvoicesReports(limit);
  }

  @Get('paid')
  // TODO: Add the relevant permissions
  async getPaidInvoices(@Query() query: ExpressQuery) {
    return await this.invoicesService.findAll(query);
  }

  @Get('unpaid')
  // TODO: Add the relevant permissions
  async getUnpaidInvoices(@Query() query: ExpressQuery) {
    return await this.invoicesService.findAll(query);
  }

  @Get('riskNote-balance/:riskNoteId')
  // TODO: Add the relevant permissions
  async getRiskNoteBalance(@Param('riskNoteId') riskNoteId: string) {
    return await this.invoiceReportsService.getRiskNoteBalance(riskNoteId);
  }
}
