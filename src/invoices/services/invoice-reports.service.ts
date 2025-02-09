import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { Invoice } from 'src/invoices/interfaces/invoice.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';

@Injectable()
export class InvoiceReportsService {
  constructor(
    @Inject(DatabaseModelEnums.INVOICE_MODEL)
    private invoices: Model<Invoice>,
  ) {}

  async getLatestInvoicesReports(limit?: number) {
    try {
      const invoicesNumber = limit ? limit : 8;
      const total = await this.invoices.countDocuments().exec();
      const invoices = await this.invoices
        .find()
        .sort({ createdAt: -1 })
        .limit(invoicesNumber);

      // return response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved ${invoices.length} latest invoices`,
        { invoices, total },
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async getInvoicesReportsByClient(clientId: string) {
    try {
      const invoices = await this.invoices
        .find({ clientId })
        .sort({ createdAt: -1 });

      // return response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved ${invoices.length} invoices`,
        invoices,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async getInvoicesReportsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<CustomHttpResponse> {
    try {
      const invoices = await this.invoices
        .find({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        })
        .sort({ createdAt: -1 });

      // return response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved ${invoices.length} invoices`,
        invoices,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  async getRiskNoteBalance(riskNoteId): Promise<CustomHttpResponse> {
    try {
      const aggregation: Array<any> = [
        {
          $addFields: {
            invoiceId: {
              $toString: '$_id',
            },
          },
        },
        {
          $match: {
            riskNoteId,
          },
        },

        {
          $project: {
            _id: 0,
            invoiceId: 1,
            balance: 1,
          },
        },
      ];
      const invoiceBalance:
        | { balance: number; invoiceId: string }[]
        | undefined = await this.invoices.aggregate(aggregation).exec();

      if (!invoiceBalance || invoiceBalance.length === 0) {
        throw new Error(
          'There was no invoice found for the risk note id: ' + riskNoteId,
        );
      }
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved balance for the risk note id ${riskNoteId}`,
        invoiceBalance[0],
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
}
