import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PlainBaseSchema } from 'src/database/schemas/base.schema';

export const MpesaPaymentSchema = new mongoose.Schema({
  merchantRequestID: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  resultCode: { type: Number, required: true },
  resultDesc: { type: String, required: true },
  amount: { type: Number, required: false },
  mpesaReceiptNumber: { type: String, required: false },
  transactionDate: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  isUsed: { type: Boolean, required: true, default: false },
  patientName: { type: String, required: false },
  isDirectPayment: { type: Boolean, required: true, default: true },

  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const MpesaPayment = mongoose.model(
  DatabaseModelEnums.MPESA_MODEL,
  MpesaPaymentSchema,
);
