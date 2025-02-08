import { Controller, Get, Query } from '@nestjs/common';
import { PatientReportsService } from 'src/patients/services/patient-reports.service';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@Controller('patient-reports')
export class PatientReportsController {
  constructor(private readonly patientReportsService: PatientReportsService) {
    //
  }

  @Get('latest')
  async getLatestPatientReports(
    @Query('limit') limit: number,
    @GenericResponse() res: GenericResponse,
  ) {
    // Get latest patient reports
    const response = await this.patientReportsService.getLatestPatientReports(
      limit,
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
