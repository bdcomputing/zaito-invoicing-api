import { Global, Module } from '@nestjs/common';
import { PatientReportsService } from './services/patient-reports.service';
import { PatientService } from './services/patient.service';
import { PatientsAutomationService } from './services/patient-automation.service';
import { PatientReportsController } from './controllers/patient-reports.controller';
import { PatientController } from './controllers/patients.controller';
import { patientProviders } from './providers/patient.providers';

const providers = [
  ...patientProviders,
  PatientService,
  PatientsAutomationService,
  PatientReportsService,
];
@Global()
@Module({
  controllers: [PatientController, PatientReportsController],
  providers: [...providers],
  exports: [...providers],
})
export class PatientsModule {
  //
}
