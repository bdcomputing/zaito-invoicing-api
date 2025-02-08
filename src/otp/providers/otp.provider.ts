import { Mongoose } from 'mongoose';
import { OTPSchema } from '../schemas/otp.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const otpProviders = [
  {
    provide: DatabaseModelEnums.OTP_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.OTP_MODEL, OTPSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
