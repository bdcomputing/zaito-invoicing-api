import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { BaseSchema } from 'src/database/schemas/base.schema';

export const BankAccountsSchema = new mongoose.Schema({
  bankId: {
    type: String,
    required: true,
    trim: true,
  },
  accountName: {
    required: true,
    type: String,
    trim: true,
  },
  accountNumber: {
    required: true,
    type: String,
    trim: true,
  },
  accountType: {
    required: true,
    type: String,
    trim: true,
  },

  holderId: {
    required: true,
    type: String,
    trim: true,
  },

  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },

  // Extend Base Schema
  ...BaseSchema.obj,
});

export const BankAccount = mongoose.model(
  DatabaseModelEnums.BANK_ACCOUNT_MODEL,
  BankAccountsSchema,
);
