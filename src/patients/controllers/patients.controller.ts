import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { CustomHttpResponse } from 'src/shared';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { RegisterPatientDto, UpdatePatientDto } from '../dto/patient.dto';
import { PatientService } from '../services/patient.service';

@ApiTags('Patients')
@Controller('patients')
export class PatientController {
  /**
   * Creates an instance of PatientController.
   * @param {PatientService} patientService - The patient service to use
   */
  constructor(private readonly patientService: PatientService) {
    //
  }

  /**
   * Register patients
   *
   * @param {( RegisterPatientDto)} patient
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PatientController
   */
  @Post()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.CREATE_PATIENT)
  async create(
    @Body() patient: RegisterPatientDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ) {
    const createdBy: string = req.user._id.toString();

    // create  patient
    const response = await this.patientService.createPatient(
      patient as RegisterPatientDto,
      createdBy,
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   *
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PatientController
   */
  @Get()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_PATIENT)
  async getAllPatients(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get all patients
    const response = await this.patientService.getAllPatients(query);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * GET handler to retrieve a patient by ID.
   *
   * @param {string} id - The ID of the patient to retrieve.
   * @returns {Promise<CustomHttpResponse>} The response containing the requested patient.
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_PATIENT)
  async getPatientById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get patient by Id
    const response = await this.patientService.getPatientById(id);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * PATCH handler to update a patient.
   *
   * @param {string} id - The ID of the patient to update
   * @param {UpdatePatientDto } payload - The updated patient data
   * @param {any} req - The request object
   * @returns {Promise<CustomHttpResponse>} The response from updating the patient
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_PATIENT)
  async updatePatient(
    @Param('id') id: string,
    @Body() payload: UpdatePatientDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    // Update patient
    const response = await this.patientService.updatePatient(
      id,
      payload,
      userId,
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
