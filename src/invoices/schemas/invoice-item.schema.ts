import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const InvoiceItemSchema = new mongoose.Schema({
  invoiceId: { type: String, required: false, trim: true },
  description: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, default: 1, trim: true },
  price: { type: Number, required: true, trim: true },
  ...BaseSchema.obj,
});

export const InvoiceItem = mongoose.model(
  DatabaseModelEnums.INVOICE_ITEM_MODEL,
  InvoiceItemSchema,
);
