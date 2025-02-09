import { Document } from 'mongoose';

export interface CreateBankAccount extends Document {
  bankId: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  holderId: string;
}

export interface BankAccount extends CreateBankAccount {
  _id: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedBy?: string;
  deletedAt?: Date;
}
