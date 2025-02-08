import { Mongoose } from 'mongoose';
import { PermissionsSchema } from '../schemas/permissions.schema';
import { RolesSchema } from '../schemas/roles.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const authorizationProviders = [
  {
    provide: DatabaseModelEnums.PERMISSION_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.PERMISSION_MODEL, PermissionsSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.ROLE_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.ROLE_MODEL, RolesSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
