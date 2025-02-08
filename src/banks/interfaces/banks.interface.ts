export interface BankBranchInterface {
  name: string;
  code?: string;
}
export interface CreateBankInterface {
  name: string;
  branches?: BankBranchInterface[];
  bank_code?: string;
}
export interface BankInterface extends CreateBankInterface {
  _id: string;
  createdBy: string;
  createdAt: Date;

  updatedBy?: string;
  updatedAt?: Date;

  deletedBy?: string;
  deletedAt?: Date;
}
