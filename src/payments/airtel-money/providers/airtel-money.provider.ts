import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { AirtelMoneyPaymentSchema } from '../schemas/airtel-money.schema';

export const airtelMoneyProviders = [
  {
    provide: DatabaseModelEnums.AIRTEL_MONEY_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(
        DatabaseModelEnums.AIRTEL_MONEY_MODEL,
        AirtelMoneyPaymentSchema,
      ),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
