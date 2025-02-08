import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../enums/permission.enum';

export const RequiredPermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata('permissions', permissions);
