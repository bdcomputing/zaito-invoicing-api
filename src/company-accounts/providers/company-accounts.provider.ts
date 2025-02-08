import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from '../../database/enums/database.enum';
import { CompanyAccountsSchema } from 'src/company-accounts/schemas/company-accounts.schema';

export const companyAccountsProviders = [
  {
    provide: DatabaseModelEnums.COMPANY_ACCOUNT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(
        DatabaseModelEnums.COMPANY_ACCOUNT_MODEL,
        CompanyAccountsSchema,
      ),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
