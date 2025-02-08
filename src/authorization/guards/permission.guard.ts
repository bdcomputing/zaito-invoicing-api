import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/services/users.service';
import { PermissionEnum } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  /**
   * The constructor for the permissions guard.
   *
   * @param reflector - The reflector service used to get the permissions metadata.
   * @param usersService - The users service used to get the permissions of the user.
   */
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Determines whether the request can be processed by the controller.
   *
   * It checks if the user has the required permissions to access the controller.
   * If the user does not have the required permissions, it returns false.
   * If the user has the required permissions, it returns true.
   *
   * @param context - The execution context of the request.
   * @returns A boolean indicating whether the request can be processed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getHandler(), context.getClass()]);

    if (!requirePermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }
    // get the logged-in user permissions
    const permissions = (await this.usersService.findByEmail(user.email)).data
      .permissions;

    // check if the user has the right permissions
    return requirePermissions.some((permission) =>
      permissions.includes(permission),
    );
  }
}
