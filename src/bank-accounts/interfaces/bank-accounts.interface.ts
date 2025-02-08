import { Document } from 'mongoose';

export interface CreateBankAccountInterface extends Document {
  bankId: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  holderId: string;
}

export interface BankAccountInterface extends CreateBankAccountInterface {
  _id: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedBy?: string;
  deletedAt?: Date;
}
