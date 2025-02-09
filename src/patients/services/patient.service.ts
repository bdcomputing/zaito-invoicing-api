/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Patient } from 'src/patients/interfaces/patient.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';

import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { generatePassword } from 'src/shared/utils/password-generator.util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PaginatedData } from 'src/database/interfaces/paginated-data.interface';
import { PostUserDto } from 'src/users/dto/register-user.dto';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/interfaces/user.interface';
import {
  RegisterPatientDto,
  PostPatientDto,
  UpdatePatientDto,
} from '../dto/patient.dto';

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);

  /**
   * Creates an instance of PatientService.
   * @param {Model<Patient>} patient
   * @param {EventEmitter2} eventEmitter
   * @param {UsersService} usersService
   * @memberof PatientService
   */
  constructor(
    @Inject(DatabaseModelEnums.PATIENT_MODEL)
    private patient: Model<Patient>,
    private eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create  Patient Account
   *
   * @param {RegisterPatientDto} patientDto
   * @param {string} createdBy
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PatientService
   */
  async createPatient(
    patientDto: RegisterPatientDto,
    createdBy?: string,
  ): Promise<CustomHttpResponse> {
    try {
      const {
        email,
        KRA_PIN,
        idNumber,
        phone,
        patientName,
        patientManager,
        dateOfBirth,
        gender,
        zipCode,
        street,
        town,
        country,
      } = patientDto;

      // find all users
      const users = await this.usersService.findAll();

      if (users) {
        const emailExist = users.find((u: User) => {
          u.email === email;
        });

        // confirm Email
        if (emailExist) {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.OK,
            'The email you have provided already exists',
            null,
          );
        }

        // confirm phone
        const phoneExist = users.find((u: User) => {
          u.phone === phone;
        });

        if (phoneExist) {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.OK,
            'The phone number you have provided already exists',
            null,
          );
        }
        const patients = await this.patient.find().exec();
        // confirm KRA PIN
        const KRA_PINExist = patients.find((c: Patient) => {
          c.KRA_PIN === KRA_PIN;
        });

        if (KRA_PINExist) {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.OK,
            'The KRA PIN you have provided already exists',
            null,
          );
        }
      }
      const patients: Patient[] = await this.patient
        .find({}, { idNumber: 1, KRA_PIN: 1, _id: 1 })
        .exec();

      /**
       * Checks if the provided incorporation number already exists for a patient.
       *
       * @param {Patient[]} patients - The list of existing patients to search.
       * @param {string} patientDto.id - The id number to check.
       * @returns {Patient} The patient with matching incorporation number, if found.
       */
      if (patientDto.idNumber && patientDto.idNumber.length > 0) {
        const idNumberExists: Patient = patients.find((cl: Patient) => {
          return cl.idNumber === patientDto.idNumber;
        });

        // Check if ID number exists
        if (idNumberExists) {
          // return response
          return new CustomHttpResponse(
            HttpStatusCodeEnum.BAD_REQUEST,
            'ID Number number already exists!',
            null,
          );
        }
      }

      if (patientDto.KRA_PIN && patientDto.KRA_PIN.length > 0) {
        const KRAPinExists = patients.find((patient: Patient) => {
          return (
            patient.KRA_PIN.toUpperCase() === patientDto.KRA_PIN.toUpperCase()
          );
        });
        if (KRAPinExists) {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.BAD_REQUEST,
            'KRA Pin Number number already exists!',
            null,
          );
        }

        const KRAPinStartsWith =
          patientDto.KRA_PIN.toUpperCase().startsWith('A') ||
          patientDto.KRA_PIN.toUpperCase().startsWith('P');

        if (!KRAPinStartsWith) {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.BAD_REQUEST,
            'KRA Pin Number format is wrong!',
            null,
          );
        }
      }

      /**
       * Create a new patient data object with details like name, email,
       * phone etc. to be passed to patient.create() method.
       *
       * This takes the data from the input patientDto and formats it
       * into the PostPatientDto type to match the DB model.
       */
      const patientData: PostPatientDto = {
        patientName,
        email,
        phone,
        KRA_PIN,
        idNumber,
        patientManager,
        dateOfBirth,
        gender,
        zipCode,
        street,
        town,
        country,
        createdBy,
      };

      const patient = await this.patient.create(patientData);

      /**
       * Create a user account for the new patient if requested.
       *
       * If the email and password, create a user account for the new
       * patient with their name, email, password etc. and link it to the new
       * patient document. Call the usersService to create the user in the DB.
       */
      if (patientDto.email && patientDto.password) {
        const password: string = patientDto.password
          ? patientDto.password
          : generatePassword({ includeSpecialChars: true });
        const patientId = patient._id.toString();

        // prepare the user dto
        const userData: PostUserDto = {
          patientId,
          name: patientName,
          isBackOfficeUser: false,
          email,
          password,
          phone,
          createdBy,
        };

        // create the user
        const user: User = (await this.usersService.create(userData)).data;

        this.eventEmitter.emit(SystemEventsEnum.UserCreated, user);
      }

      // Emit the event that the patient has been created
      this.eventEmitter.emit(SystemEventsEnum.PatientCreated, patient);

      return new CustomHttpResponse(
        HttpStatusCodeEnum.CREATED,
        `Patient ${patient.patientName} created successfully!`,
        patient,
      );
    } catch (error) {
      this.logger.error(error);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `There was an issue creating patient ${patientDto.patientName}!`,
        error,
      );
    }
  }

  /**
   * Get a patient by ID.
   *
   * @param {string} id - The ID of the patient to retrieve.
   * @returns {Promise<Patient>} A promise that resolves to the patient document.
   */
  async findOne(id: string): Promise<Patient> {
    return this.patient.findById(id).exec();
  }

  /**
   * Update Patient details
   *
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof PatientService
   */
  async update(id: string, payload: any): Promise<any> {
    const filter = { _id: id };
    const update = payload;
    const updatedPatient = await this.patient.findOneAndUpdate(filter, update, {
      returnOriginal: false,
    });
    // Emit the event that the patient has been created
    this.eventEmitter.emit(SystemEventsEnum.PatientUpdated, updatedPatient);
    return updatedPatient;
  }

  /**
   * Get all Patients
   *
   * @return {*}  {Promise<CustomHttpResponse>}Poa
   * @memberof PatientService
   */
  async getAllPatients(query?: ExpressQuery): Promise<CustomHttpResponse> {
    try {
      const limitQ = query.limit;
      const totalDocuments = await this.patient.find().countDocuments().exec();
      const limit = +limitQ === -1 ? totalDocuments : +query.limit || 50;
      const keyword = query.keyword ? query.keyword : '';
      const page = +query.page || 1;
      const skip = limit * (page - 1);
      const slim: boolean = query.slim
        ? JSON.parse(query.slim as string)
        : false;
      const search =
        query.hasOwnProperty('limit') || query.hasOwnProperty('page')
          ? {
              $or: [
                {
                  patientName: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                {
                  email: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                {
                  phone: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                // {
                //   idNumber: {
                //     $regex: +keyword,
                //     $options: 'i',
                //   },
                // },
                {
                  KRA_PIN: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },

                // {
                //   address: {
                //     $regex: keyword,
                //     $options: 'i',
                //   },
                // },
                {
                  serial: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
              ],
            }
          : {};

      // get all the patients
      const patients: Patient[] = ([] = await this.patient
        .find(
          { ...search },
          slim
            ? { _id: 1, patientName: 1, phone: 1, email: 1, KRA_PIN: 1 }
            : {},
        )
        .limit(limit)
        .skip(skip)
        .sort({ patientName: 1 })
        .exec());

      const total = await this.patient
        .find({ ...search })
        .countDocuments()
        .exec();

      const pages = Math.ceil(total / limit);

      // prepare the response
      const response: PaginatedData = {
        page,
        limit,
        total,
        data: patients,
        pages,
      };
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Patient list loaded successfully!',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  /**
   * Get patient by ID
   *
   * @param {string} id - The ID of the patient to retrieve
   * @returns {Promise<CustomHttpResponse>} A promise resolving to the HTTP response containing the patient data
   */
  async getPatientById(id: string): Promise<CustomHttpResponse> {
    try {
      const patient = await this.findById(id);

      if (!patient) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          'There is no patient with the id you have provided. Try again!',
          null,
        );
      }
      this.eventEmitter.emit(SystemEventsEnum.PatientUpdated, patient);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Patient loaded successfully!',
        patient,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }
  /**
   * Update patient
   *
   * @param {string} id
   * @param {UpdatePatientDto} data
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PatientService
   */
  async updatePatient(
    id: string,
    data: UpdatePatientDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: any = data as unknown as any;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      // Remove the fields to be updated
      const { accountType, _id, createdBy, createdAt, __v, ...update } =
        payload;
      // update the patient group
      const patient = await this.patient.findOneAndUpdate(filter, update, {
        returnOriginal: false,
      });

      // Emit the event that the patient has been created
      this.eventEmitter.emit(SystemEventsEnum.PatientUpdated, patient);

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Patient updated successfully!',
        patient,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  /**
   * Find all Patients
   *
   * @return {*}  {Promise<Patient[]>}
   * @memberof PatientService
   */
  async findAll(): Promise<Patient[]> {
    return this.patient.find().exec();
  }

  /**
   * Find Patient by ID
   *
   * @param {string} id
   * @return {*}  {Promise<Patient>}
   * @memberof PatientService
   */
  async findById(id: string): Promise<Patient> {
    return this.patient.findById(id);
  }
}
