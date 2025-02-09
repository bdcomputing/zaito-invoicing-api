// import { Inject, Injectable } from '@nestjs/common';
// import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
// import { Model } from 'mongoose';
// import { DatabaseModelEnums } from 'src/database/enums/database.enum';
// import { SystemEventsEnum } from 'src/events/enums/events.enum';
// import { CustomHttpResponse } from 'src/shared';
// import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
// import { CreateInvoicePaymentDto } from 'src/invoices/dto/create-invoice-payment.dto';
// import { InvoicePayment } from 'src/invoices/interfaces/invoice-payment.interface';
// import { Invoice } from 'src/invoices/interfaces/invoice.interface';

// @Injectable()
// export class InvoicePaymentsService {
//   /**
//    * Creates an instance of InvoicePaymentsService.
//    * @param {Model<InvoicePayment>} invoicePayments
//    * @param {Model<Invoice>} invoice
//    * @param {EventEmitter2} eventEmitter
//    * @memberof InvoicePaymentsService
//    */
//   constructor(
//     @Inject(DatabaseModelEnums.RECEIPTS_MODEL)
//     private readonly invoicePayments: Model<InvoicePayment>,
//     @Inject(DatabaseModelEnums.INVOICE_MODEL)
//     private readonly invoice: Model<Invoice>,
//     private readonly eventEmitter: EventEmitter2,
//   ) {
//     //
//   }

//   /**
//    * Create Invoice Payment Entry
//    *
//    * @param {{
//    *     userId: string;
//    *     receipt: PaymentAllocationReceipt;
//    *   }} data
//    * @memberof InvoicePaymentsService
//    */
//   @OnEvent(SystemEventsEnum.AllocationReceiptCreated, { async: true })
//   @OnEvent(SystemEventsEnum.AllocationReceiptUpdated, { async: true })
//   async createInvoicePaymentEntry(data: {
//     userId: string;
//     receipt: PaymentAllocationReceipt;
//   }) {
//     const { receipt } = data;
//     const allocations = data.receipt.allocation || [];
//     const receiptId: string = receipt._id.toString();
//     for (let i = 0; i < allocations.length; i++) {
//       const allocation = allocations[i];
//       const exists: { _id: string } = (await this.invoicePayments
//         .findOne({
//           invoiceId: allocation.invoiceId,
//           receiptId,
//         })
//         .exec()) as any;

//       const payload: CreateInvoicePaymentDto = {
//         receiptId,
//         clientId: receipt.clientId,
//         invoiceId: allocation.invoiceId,
//         paidAmount: allocation.allocatedAmount,
//         createdBy: receipt.createdBy,
//         createdAt: receipt.createdAt,
//       };

//       if (exists) {
//         const filter = { _id: exists._id };
//         await this.invoicePayments
//           .findOneAndUpdate(filter, payload, { returnOriginal: false })
//           .exec();

//         // emit the event for the allocation
//         this.eventEmitter.emit(SystemEventsEnum.InvoicePaymentEntryMade, {
//           invoiceId: allocation.invoiceId,
//           userId: receipt.createdBy,
//         });
//         // emit the event for the allocation recon
//         this.eventEmitter.emit(
//           SystemEventsEnum.UpdatePremiumPaymentOnInvoiceUpdated,
//           {
//             receiptId,
//             userId: receipt.createdBy,
//           },
//         );
//       } else {
//         await this.invoicePayments.create(payload);
//         // emit the event for the allocation
//         this.eventEmitter.emit(SystemEventsEnum.InvoicePaymentEntryMade, {
//           invoiceId: allocation.invoiceId,
//           userId: receipt.createdBy,
//         });

//         // emit the event for the allocation recon
//         this.eventEmitter.emit(
//           SystemEventsEnum.UpdatePremiumPaymentOnInvoiceUpdated,
//           {
//             receiptId,
//             userId: receipt.createdBy,
//           },
//         );
//       }
//     }
//   }

//   /**
//    * Update invoice balance
//    *
//    * @param {{ userId: string; invoiceId: string }} data
//    * @memberof InvoicePaymentsService
//    */
//   @OnEvent(SystemEventsEnum.InvoicePaymentEntryMade, { async: true })
//   async calculateInvoiceBalance(data: { userId: string; invoiceId: string }) {
//     const { invoiceId, userId } = data;

//     // get all the payments for the invoice
//     const payments: InvoicePayment[] = await this.invoicePayments
//       .find({ invoiceId })
//       .exec();
//     const invoice: Invoice = await this.invoice
//       .findById(invoiceId)
//       .exec();

//     const invoiceAmount = invoice.totalAmount || 0;

//     let paidAmount = 0;
//     // get the paid amount
//     for (let i = 0; i < payments.length; i++) {
//       const payment = payments[i];
//       paidAmount += payment.paidAmount;
//     }
//     // get the balance
//     const balance = invoiceAmount - paidAmount;
//     // update the invoice
//     await this.invoice
//       .findOneAndUpdate(
//         { _id: invoiceId },
//         { paidAmount, balance, updatedAt: new Date(), updatedBy: userId },
//         { returnOriginal: false },
//       )
//       .exec();
//   }

//   async getInvoicePayments(invoiceId: string): Promise<CustomHttpResponse> {
//     try {
//       const payments: InvoicePayment[] = await this.invoicePayments
//         .find({ invoiceId })
//         .exec();

//       return new CustomHttpResponse(
//         HttpStatusCodeEnum.OK,
//         'Got all payments for the invoice',
//         payments,
//       );
//     } catch (error) {
//       return new CustomHttpResponse(
//         HttpStatusCodeEnum.BAD_REQUEST,
//         'There was an issue loading payments for the invoice',
//         error,
//       );
//     }
//   }

//   async getInvoicePaymentsByReceiptId(
//     receiptId: string,
//   ): Promise<CustomHttpResponse> {
//     try {
//       const payments: InvoicePayment[] = await this.invoicePayments
//         .find({ receiptId })
//         .exec();

//       return new CustomHttpResponse(
//         HttpStatusCodeEnum.OK,
//         'Got all payments for the receipt',
//         payments,
//       );
//     } catch (error) {
//       return new CustomHttpResponse(
//         HttpStatusCodeEnum.BAD_REQUEST,
//         'There was an issue loading payments for the receipt',
//         error,
//       );
//     }
//   }
// }
