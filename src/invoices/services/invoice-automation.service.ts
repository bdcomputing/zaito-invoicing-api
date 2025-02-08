import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SequenceInterface } from 'src/database/interfaces/sequence.interface';
import { SequenceService } from 'src/database/services/sequence.service';
import { InvoiceInterface } from 'src/invoices/interfaces/invoice.interface';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { InvoicesService } from './invoices.service';

@Injectable()
export class InvoiceAutomationService {
  private logger = new Logger(InvoiceAutomationService.name);

  constructor(
    @Inject(DatabaseModelEnums.INVOICE_MODEL)
    private readonly invoices: Model<InvoiceInterface>,
    private readonly sequenceService: SequenceService,
    private readonly eventEmitter: EventEmitter2,
    private readonly invoicesService: InvoicesService,
  ) {
    //
  }

  /**
   * Upon invoice creation, assign a unique id to it
   *
   * @param {InvoiceInterface} invoice
   * @return {*}
   * @memberof InvoiceAutomationService
   */
  @OnEvent(SystemEventsEnum.InvoiceCreated, { async: true })
  async addSequenceNumberToInvoice(invoice: InvoiceInterface): Promise<any> {
    const sequence: SequenceInterface =
      await this.sequenceService.getSequence();
    const uniqueId = +sequence.invoices + 1;

    const filter = { _id: invoice._id.toString() };

    const date: Date = new Date();
    const prefix = Math.floor(100000 + Math.random() * 900000);
    const serial = `INV-${prefix}${date.getDate()}${date.getSeconds()}${date.getMilliseconds()}-${uniqueId}`;

    // Prepare payload
    const payload: any = {
      uniqueId,
      serial,
    };

    // Emit the event
    this.eventEmitter.emit(SystemEventsEnum.UpdateSequence, {
      id: sequence._id.toString(),
      payload: { invoices: uniqueId },
    });
    // Update the risk note with the ID
    return this.invoices.findOneAndUpdate(filter, payload, {
      returnOriginal: false,
    });
  }
}
