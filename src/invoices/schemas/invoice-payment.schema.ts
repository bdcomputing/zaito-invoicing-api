import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const InvoicePaymentSchema = new mongoose.Schema({
  receiptId: { type: String, required: false, trim: true },
  narration: { type: String, required: false, trim: true },
  clientId: { type: String, required: true, trim: true },
  invoiceId: { type: String, required: true, trim: true },
  paidAmount: { type: Number, required: true, default: 0, trim: true },
  // Extend Base Schema
  ...BaseSchema.obj,
});

export const InvoicePayment = mongoose.model(
  DatabaseModelEnums.RECEIPTS_MODEL,
  InvoicePaymentSchema,
);
