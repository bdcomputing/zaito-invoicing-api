import { Mongoose } from 'mongoose';
import { MpesaPaymentSchema } from '../schemas/mpesa-payment.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const mpesaPaymentProviders = [
  {
    provide: DatabaseModelEnums.MPESA_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.MPESA_MODEL, MpesaPaymentSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
