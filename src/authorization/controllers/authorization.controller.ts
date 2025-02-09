import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { AuthorizationService } from 'src/authorization/services/authorization.service';
import { CustomHttpResponse } from 'src/shared';
import { User } from 'src/users/interfaces/user.interface';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import { PermissionEnum } from '../enums/permission.enum';

@ApiTags('Authorization')
@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  /**
   * Sync the roles and permissions
   *
   * @return {*}  {Promise<Permission[]>}
   * @memberof AuthorizationController
   * @param userId
   */

  @Post('sync-permissions')
  async syncPermissions(userId?: string): Promise<CustomHttpResponse> {
    return await this.authorizationService.syncPermissions(userId);
  }
  /**
   * Get all permissions
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationController
   */
  @Get('permissions')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getAllPermissions(): Promise<CustomHttpResponse> {
    return await this.authorizationService.getAllPermissions();
  }

  @Get('roles-with-permissions')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getRolesWithPermissions(
    @Body() payload: { permissions: PermissionEnum[] },
    @Req() req: { user: User },
  ) {
    const userId: string = req.user._id.toString();
    const roles = await this.authorizationService.getRolesWithPermissions(
      payload,
      userId,
    );
    return roles;
  }
}
