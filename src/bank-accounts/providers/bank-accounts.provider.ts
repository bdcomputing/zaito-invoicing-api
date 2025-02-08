import { Mongoose } from 'mongoose';
import { BankAccountsSchema } from '../schemas/bank-accounts.schema';
import { DatabaseModelEnums } from '../../database/enums/database.enum';

export const bankAccountsProviders = [
  {
    provide: DatabaseModelEnums.BANK_ACCOUNT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.BANK_ACCOUNT_MODEL, BankAccountsSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
