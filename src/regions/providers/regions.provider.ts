import { Mongoose } from 'mongoose';
import { CountrySchema } from '../schemas/countries.schema';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const countryProviders = [
  {
    provide: DatabaseModelEnums.COUNTRY_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.COUNTRY_MODEL, CountrySchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
