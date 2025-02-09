import { Bank } from 'src/banks/interfaces/banks.interface';

export interface CompanyAccount {
  _id: string;
  bankId?: string;
  accountName: string;
  accountNumber: string;
  clearedBalance: number;
  unclearedBalance: number;
  isBankAccount: boolean;
  description?: string;
  bank?: Bank;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
  deletedBy?: string;
  deletedAt?: Date;
}
