import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PlainBaseSchema } from 'src/database/schemas/base.schema';

export const CountrySchema = new mongoose.Schema({
  name: { type: String, required: true, sparse: true, trim: true },
  code: {
    type: String,
    required: true,
    sparse: true,
    trim: true,
    unique: true,
  },
  supported: {
    type: Boolean,
    required: true,
    sparse: true,
    trim: true,
    default: false,
  },
  mobileCode: {
    type: String,
    required: true,
    sparse: true,
    trim: true,
  },
  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const Country = mongoose.model(
  DatabaseModelEnums.COUNTRY_MODEL,
  CountrySchema,
);
