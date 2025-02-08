import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { LogsSchema } from '../schemas/logs.schema';
import { AuthLogsSchema } from '../schemas/auth-logs.schema';

export const logsProviders = [
  {
    provide: DatabaseModelEnums.LOG_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.LOG_MODEL, LogsSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.AUTH_LOG_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.AUTH_LOG_MODEL, AuthLogsSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
