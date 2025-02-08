import { Mongoose } from 'mongoose';
import { SettingsSchema } from '../schemas/settings.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { ClinicSettingsSchema } from '../schemas/clinic-settings.schema';

export const settingsProviders = [
  {
    provide: DatabaseModelEnums.SETTING_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.SETTING_MODEL, SettingsSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.CLINIC_SETTING_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(
        DatabaseModelEnums.CLINIC_SETTING_MODEL,
        ClinicSettingsSchema,
      ),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
