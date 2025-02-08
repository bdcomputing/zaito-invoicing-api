import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PlainBaseSchema } from 'src/database/schemas/base.schema';

export const AirtelMoneyPaymentSchema = new mongoose.Schema({
  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const AirtelMoneyPayment = mongoose.model(
  DatabaseModelEnums.AIRTEL_MONEY_MODEL,
  AirtelMoneyPaymentSchema,
);
