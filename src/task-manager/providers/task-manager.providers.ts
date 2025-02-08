import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { TasksSchema } from '../schemas/tasks.schema';

export const taskManagerProviders = [
  {
    provide: DatabaseModelEnums.TASKS_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.TASKS_MODEL, TasksSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
