import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationService } from '../services/authorization.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { CustomHttpResponse } from 'src/shared';
import { RequiredPermissions } from '../decorators/permissions.decorator';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PermissionEnum } from '../enums/permission.enum';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly authorizationService: AuthorizationService) {
    //
  }

  /**
   * Create a role
   *
   * @param {CreateRoleDto} payload
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationController
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.CREATE_ROLE)
  async createRole(
    @Body() payload: CreateRoleDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    const response: CustomHttpResponse =
      await this.authorizationService.createRole(payload, userId);
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all roles
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationController
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getAllRoles(@Req() req: any): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    return await this.authorizationService.getAllRoles(userId);
  }

  /**
   * Get role by id
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_ROLE)
  async getRoleById(@Param('id') id: string): Promise<CustomHttpResponse> {
    return await this.authorizationService.getRoleById(id);
  }

  /**
   * Update a role using role id
   *
   * @param {string} id
   * @param {Partial<UpdateRoleDto>} payload
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_ROLE)
  async updateRole(
    @Param('id') id: string,
    @Body() payload: Partial<UpdateRoleDto>,
    @Req() req: any,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    return await this.authorizationService.updateRoleById(id, payload, userId);
  }
}
