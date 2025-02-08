import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SequenceSchema } from '../schemas/sequence.schema';

export const databaseProviders = [
  {
    provide: DatabaseModelEnums.SEQUENCE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.SEQUENCE_MODEL, SequenceSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
