import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomHttpResponse } from 'src/shared';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { AuthorizationGuard } from 'src/authorization/guards/authorization.guard';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { UsersService } from 'src/users/services/users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   * @param {UsersService} usersService
   * @memberof UsersController
   */
  constructor(private readonly usersService: UsersService) {
    //
  }

  /**
   * Get all users who can login to the system
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_USER)
  async getAllUsers(
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = this.usersService.getAllUsers();
    // set response status code
    res.setStatus((await response).statusCode);
    // return response
    return response;
  }

  /**
   * Get users with the role id
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Get('role/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE, PermissionEnum.VIEW_USER)
  async getUsersWithRoleId(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = await this.usersService.getUsersUsingRole(id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get user by user id
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_USER)
  async getUserById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = await this.usersService.getUserUsingId(id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
