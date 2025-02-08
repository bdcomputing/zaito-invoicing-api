import { Mongoose } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PatientSchema } from '../schemas/patient.schema';

export const patientProviders = [
  {
    provide: DatabaseModelEnums.PATIENT_MODEL,
    useFactory: (mongoose: Mongoose) =>
      mongoose.model(DatabaseModelEnums.PATIENT_MODEL, PatientSchema),
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
