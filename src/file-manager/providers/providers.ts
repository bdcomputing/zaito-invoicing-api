import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { FileManagerSchema } from '../schemas/file-manager.schema';

export const fileManagerProviders = [
  {
    provide: DatabaseModelEnums.FILE_MANAGER_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.FILE_MANAGER_MODEL, FileManagerSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
