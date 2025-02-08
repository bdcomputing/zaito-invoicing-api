import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const CompanyAccountsSchema = new mongoose.Schema({
  bankId: {
    type: String,
    required: false,
    trim: true,
  },
  accountName: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },
  accountNumber: {
    required: true,
    type: String,
    trim: true,
  },
  isBankAccount: {
    type: Boolean,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  clearedBalance: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },
  unclearedBalance: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  // Extend Base Schema
  ...BaseSchema.obj,
});

export const CompanyAccount = mongoose.model(
  DatabaseModelEnums.COMPANY_ACCOUNT_MODEL,
  CompanyAccountsSchema,
);
