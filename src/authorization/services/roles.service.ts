import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { RoleInterface } from '../interfaces/roles.interface';
import { RolesEnum } from '../data/default-roles.data';

@Injectable()
export class RolesService {
  /**
   * Creates an instance of RolesService.
   * @param {Model<RoleInterface>} roles
   * @memberof RolesService
   */
  constructor(
    @Inject(DatabaseModelEnums.ROLE_MODEL)
    private roles: Model<RoleInterface>,
  ) {}
  /**
   * Finds the role for clinics
   *
   * @returns the role object for clinics if found, undefined otherwise
   */
  async getClinicRole(): Promise<RoleInterface | undefined> {
    try {
      return await this.roles.findOne({ role: RolesEnum.ClinicRole }).exec();
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Finds the role for patients
   *
   * @returns the role object for patients if found, undefined otherwise
   */
  async getPatientRole(): Promise<RoleInterface | undefined> {
    try {
      return await this.roles.findOne({ role: RolesEnum.PatientRole }).exec();
    } catch (error) {
      return undefined;
    }
  }
}
