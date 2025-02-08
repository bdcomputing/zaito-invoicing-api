import { CreateCompanyAccountDto } from '../dto/create-company-account.dto';

export const DefaultCompanyAccountsData: CreateCompanyAccountDto[] = [
  {
    accountNumber: 'CASH',
    accountName: 'CASH',
    isBankAccount: false,
  },
  {
    accountNumber: 'PETTY-CASH',
    accountName: 'PETTY CASH',
    isBankAccount: false,
  },
];
