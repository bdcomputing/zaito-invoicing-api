import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { PatientInterface } from '../interfaces/patient.interface';

@Injectable()
export class PatientReportsService {
  /**
   * Constructs an instance of the PatientReportsService.
   * @param patients - The model for the Patient collection in the database.
   */
  constructor(
    @Inject(DatabaseModelEnums.PATIENT_MODEL)
    private patients: Model<PatientInterface>,
  ) {
    //
  }

  async getLatestPatientReports(limit?: number) {
    try {
      const patientsNumber = limit ? limit : 8;
      const total = await this.patients.countDocuments().exec();
      const patients = await this.patients
        .find()
        .sort({ createdAt: -1 })
        .limit(patientsNumber);
      // return response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Successfully retrieved ${patients.length} latest patients`,
        { patients, total },
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
}
