import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const OTPSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    required: false,
    type: String,
    trim: true,
    sparse: true,
  },
  email: {
    required: false,
    type: String,
    trim: true,
    sparse: true,
  },
  token: {
    required: false,
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  use: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  expiry: {
    type: String,
    required: false,
    trim: true,
  },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const OTP = mongoose.model(DatabaseModelEnums.OTP_MODEL, OTPSchema);
