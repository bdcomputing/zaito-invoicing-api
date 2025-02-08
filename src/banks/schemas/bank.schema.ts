import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PlainBaseSchema } from 'src/database/schemas/base.schema';

export const BanksSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  branches: { type: Array, required: false, trim: true },
  bank_code: { type: String, required: false, trim: true },
  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const Bank = mongoose.model(DatabaseModelEnums.BANK_MODEL, BanksSchema);
