import { Mongoose } from 'mongoose';
import { UserSchema } from '../schemas/user.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const userProviders = [
  {
    provide: DatabaseModelEnums.USER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.USER_MODEL, UserSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
