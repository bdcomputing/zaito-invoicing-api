export interface BankBranch {
  name: string;
  code?: string;
}
export interface CreateBank {
  name: string;
  branches?: BankBranch[];
  bank_code?: string;
}
export interface Bank extends CreateBank {
  _id: string;
  createdBy: string;
  createdAt: Date;

  updatedBy?: string;
  updatedAt?: Date;

  deletedBy?: string;
  deletedAt?: Date;
}
