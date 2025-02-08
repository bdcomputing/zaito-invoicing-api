import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { CreateRoleInterface } from '../interfaces/roles.interface';

export enum RolesEnum {
  SuperAdminRole = 'Super Administrator',
  ClinicRole = 'Administrator',
  PatientRole = 'Patient',
}
export const DefaultRolesData: CreateRoleInterface[] = [
  {
    role: RolesEnum.SuperAdminRole,
    permissions: Object.values(PermissionEnum),
  },
  {
    role: RolesEnum.ClinicRole,
    permissions: Object.values(PermissionEnum),
  },
  {
    role: RolesEnum.PatientRole,
    permissions: Object.values(PermissionEnum),
  },
];
