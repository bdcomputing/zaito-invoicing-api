import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const InvoiceSchema = new mongoose.Schema({
  serial: { type: String, required: false, trim: true },
  narration: { type: String, required: false, trim: true },
  clientId: { type: String, required: true, trim: true },
  subTotal: { type: Number, required: true, default: 0, trim: true },
  vatAmount: { type: Number, required: true, default: 0, trim: true },
  vatRate: { type: Number, required: true, default: 0, trim: true },
  totalAmount: { type: Number, required: true, default: 0, trim: true },
  paidAmount: { type: Number, required: true, default: 0, trim: true },
  balance: { type: Number, required: true, default: 0, trim: true },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const Invoice = mongoose.model(
  DatabaseModelEnums.INVOICE_MODEL,
  InvoiceSchema,
);
