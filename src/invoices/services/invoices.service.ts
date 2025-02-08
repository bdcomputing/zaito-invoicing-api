import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PaginatedDataInterface } from 'src/database/interfaces/paginated-data.interface';
import {
  PrepareQueryForInvoice,
  PrepareQueryForInvoices,
} from 'src/invoices/helpers/invoices-query.helper';
import { CreateInvoiceDto, PostInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InvoiceInterface } from '../interfaces/invoice.interface';
import { InvoiceItemDto, PostInvoiceItemDto } from '../dto/invoice-item.dto';
import { InvoiceItemInterface } from '../interfaces/invoice-item.interface';

@Injectable()
export class InvoicesService {
  private logger = new Logger(InvoicesService.name);

  constructor(
    @Inject(DatabaseModelEnums.INVOICE_MODEL)
    private invoices: Model<InvoiceInterface>,
    @Inject(DatabaseModelEnums.INVOICE_ITEM_MODEL)
    private invoiceItems: Model<InvoiceItemInterface>,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Create a invoice
   *
   * @param {CreateInvoiceDto} createInvoiceDto
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesService
   */
  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const { items, clientId, narration } = createInvoiceDto;
      const payload: PostInvoiceDto = {
        clientId,
        subTotal: 0,
        vatAmount: 0,
        vatRate: 0,
        totalAmount: 0,
        createdBy: userId,
        balance: 0,
      };

      // prepare the invoice
      const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      payload.subTotal = total;
      payload.totalAmount = total;
      payload.balance = total;

      let invoice = await this.invoices.create(payload);

      // add all the items
      for (let i = 0; i < items.length; i++) {
        const item: InvoiceItemDto = items[i];
        const payload: PostInvoiceItemDto = {
          invoiceId: invoice.id,
          createdBy: userId,
          ...item,
        };
        await this.invoiceItems.create(payload);
      }

      // Emit the event that the invoice has been created
      this.eventEmitter.emit(SystemEventsEnum.InvoiceCreated, invoice);

      // get the invoice
      invoice = (await this.findOne(invoice.id)).data;

      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        'Invoice has been created successfully',
        invoice,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Find all invoices
   *
   * @param {string} [clientId]
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesService
   */
  async findAll(query: ExpressQuery): Promise<CustomHttpResponse> {
    try {
      // Prepare search query
      const limit = query && query.limit ? +query.limit : 50;
      const paidStatus: boolean | undefined =
        query && query.paidStatus
          ? JSON.parse(query.paidStatus as string)
          : undefined;
      const clientId = query && query.clientId ? query.clientId : '';
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      const sort: any =
        query && query.sort
          ? { ...(query.sort as any) }
          : { createdAt: -1, expiryDate: 1 };

      const search: Array<any> =
        PrepareQueryForInvoices({
          keyword: keyword as string,
          skip,
          sort,
          limit,
          clientId: clientId as string,
          paid: paidStatus,
        }) || [];

      const invoices: InvoiceInterface[] = await this.invoices
        .aggregate(search)
        .exec();
      const counts = await this.invoices
        .aggregate([...search.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts.length > 0 ? counts[0].count : 0;

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedDataInterface = {
        page,
        limit,
        total,
        pages,
        data: invoices,
      };

      // return response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved ${invoices.length} invoices`,
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  /**
   * Find a invoice by id
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesService
   */
  async findOne(invoiceId: string): Promise<CustomHttpResponse> {
    try {
      const aggregation: Array<any> = await PrepareQueryForInvoice(invoiceId);
      // Get invoice
      const invoice: InvoiceInterface[] = await this.invoices
        .aggregate(aggregation)
        .exec();

      if (invoice.length < 1) {
        throw new Error('Invoice not found');
      }

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Invoice loaded from database successfully!',
        invoice[0],
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading Invoice from database',
        error,
      );
    }
  }

  /**
   * Finds a invoice by the given risk note ID.
   *
   * @param riskNoteId - The ID of the risk note to find the associated invoice for.
   * @returns A CustomHttpResponse containing the found invoice if successful,
   *          otherwise an error response.
   */
  async findInvoiceByRiskNoteNumber(
    riskNoteId: string,
  ): Promise<CustomHttpResponse> {
    try {
      // Get invoice
      const invoice: InvoiceInterface = await this.invoices
        .findOne({ riskNoteId })
        .exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Invoice loaded from database successfully!',
        invoice,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading Invoice from database',
        error,
      );
    }
  }

  /**
   * Update Invoice by ID
   *
   * @param {string} id
   * @param {UpdateInvoiceDto} updateInvoiceDto
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesService
   */
  async update(data: {
    id: string;
    updateInvoiceDto: UpdateInvoiceDto;
    userId: string;
  }): Promise<CustomHttpResponse> {
    try {
      const { id, updateInvoiceDto, userId } = data;
      const filter = { _id: id };
      const payload: any = updateInvoiceDto as unknown as any;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Remove the fields to be updated
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, createdBy, createdAt, __v, ...update } = payload;

      const invoice = await this.invoices.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });
      this.eventEmitter.emit(SystemEventsEnum.InvoiceUpdated, invoice);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Invoice updated successfully!',
        invoice,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
  /**
   * Find all invoices with a balance
   *
   * @param {{
   *     clientId?: string;
   *     insurerId?: string;
   *   }} payload
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof InvoicesService
   */
  async findAllWithBalance(payload: {
    clientId?: string;
    insurerId?: string;
  }): Promise<CustomHttpResponse> {
    try {
      const clientId: string = payload.clientId ? payload.clientId : '';
      const insurerId: string = payload.insurerId ? payload.insurerId : '';
      const aggregation: Array<any> = [
        {
          $addFields: {
            cnId: {
              $toObjectId: '$clientId',
            },
          },
        },
        {
          $lookup: {
            from: 'clients',
            localField: 'cnId',
            foreignField: '_id',
            as: 'client',
          },
        },
        {
          $unwind: '$client',
        },
        {
          $addFields: {
            rnId: {
              $toObjectId: '$riskNoteId',
            },
          },
        },
        {
          $lookup: {
            from: 'risk_notes',
            localField: 'rnId',
            foreignField: '_id',
            as: 'riskNote',
          },
        },
        {
          $unwind: '$riskNote',
        },
        {
          $addFields: {
            dnId: {
              $toString: '$_id',
            },
          },
        },
        {
          $lookup: {
            from: 'commissions',
            localField: 'dnId',
            foreignField: 'invoiceId',
            as: 'commission',
          },
        },
        {
          $unwind: '$commission',
        },
        {
          $match: {
            clientId: {
              $regex: clientId,
              $options: 'i',
            },

            'riskNote.insurerId': {
              $regex: insurerId,
              $options: 'i',
            },

            balance: {
              $gt: 0,
            },
          },
        },
      ];

      const invoices: InvoiceInterface[] = await this.invoices
        .aggregate(aggregation)
        .exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Invoices loaded from database successfully!',
        invoices,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an issue loading Invoices from database',
        error,
      );
    }
  }

  remove(id: string) {
    return `This action removes a #${id} invoice`;
  }
}
