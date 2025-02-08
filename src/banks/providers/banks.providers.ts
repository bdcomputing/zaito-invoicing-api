import { Mongoose } from 'mongoose';
import { BanksSchema } from '../schemas/bank.schema';
import { DatabaseModelEnums } from '../../database/enums/database.enum';

export const banksProviders = [
  {
    provide: DatabaseModelEnums.BANK_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.BANK_MODEL, BanksSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
