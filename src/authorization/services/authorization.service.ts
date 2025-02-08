import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateRoleInterface,
  RoleInterface,
} from '../interfaces/roles.interface';
import { Model } from 'mongoose';
import { CustomHttpResponse } from 'src/shared';
import { DefaultPermissionsData } from '../data/permissions.data';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { DefaultRolesData } from '../data/default-roles.data';
import { CreateRoleDto, PostRoleDto } from '../dto/create-role.dto';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { RegisterPermissionDto } from '../dto/permission.dto';
import { PermissionInterface } from '../interfaces/permission.interface';
import { PermissionEnum } from '../enums/permission.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';

@Injectable()
export class AuthorizationService implements OnModuleInit {
  /**
   * Creates an instance of AuthorizationService.
   * @param {Model<RoleInterface>} roles
   * @param {Model<PermissionInterface>} permissions
   * @memberof AuthorizationService
   */
  constructor(
    @Inject(DatabaseModelEnums.ROLE_MODEL)
    private roles: Model<RoleInterface>,
    @Inject(DatabaseModelEnums.PERMISSION_MODEL)
    private permissions: Model<PermissionInterface>,
  ) {}
  async onModuleInit() {
    await this.syncPermissions();
  }
  /**
   *Seed all the permissions
   *
   * @return {*}  {Promise<PermissionInterface[]>}
   * @memberof AuthorizationService
   */
  @OnEvent(SystemEventsEnum.SyncSuperUserAccount, { async: true })
  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async syncPermissions(createdBy?: string): Promise<CustomHttpResponse> {
    try {
      let permissions: any = await this.permissions.find().exec();
      const defaultPermissionsData = DefaultPermissionsData;
      const perms: string[] = [];
      await permissions.forEach((element: { permission: string }) => {
        perms.push(element.permission);
      });
      // Loop through all the permissions
      if (defaultPermissionsData.length !== perms.length) {
        for (let i = 0; i < defaultPermissionsData.length; i++) {
          const permission = defaultPermissionsData[i];
          if (!perms.includes(permission)) {
            const payload: RegisterPermissionDto = {
              permission,
            };
            await this.permissions.create(payload);
          }
        }
        permissions = await this.permissions.find().exec();
      }
      await this.syncRoles({
        userId: createdBy,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Permissions Synced Successfully',
        null,
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
   * Create a role
   *
   * @param {CreateRoleDto} data
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationService
   */
  async createRole(
    data: CreateRoleDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const roles = await this.roles.find().exec();
      const _roleFromDB = roles.find((rl: RoleInterface) => {
        return rl.role === data.role;
      });

      if (_roleFromDB) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The role you are trying to create exists',
          null,
        );
      } else {
        const payload: PostRoleDto = data as unknown as PostRoleDto;
        payload.createdBy = userId;
        const role = await this.roles.create(payload);
        return new CustomHttpResponse(
          HttpStatusCodeEnum.CREATED,
          'The role was created successfully!',
          role,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error,
      );
    }
  }

  /**
   * Update a role using role id
   *
   * @param {string} id
   * @param {Partial<CreateRoleDto>} data
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationService
   */
  async updateRoleById(
    id: string,
    data: Partial<CreateRoleDto>,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const role = await this.updateRole(id, data, userId);
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Role updated successfully!',
        role,
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
   * Sync Roles
   *
   * @param {{ userId: string }} data
   * @return {*}  {Promise<RoleInterface[]>}
   * @memberof AuthorizationService
   */
  async syncRoles(data: { userId: string }): Promise<RoleInterface[]> {
    const roles = await this.roles.find().exec();
    const defaultRolesData = DefaultRolesData;

    // Loop through the default roles
    for (let i = 0; i < defaultRolesData.length; i++) {
      const role: CreateRoleInterface = defaultRolesData[i];
      const _roleFromDB = roles.find((rl: RoleInterface) => {
        return rl.role === role.role;
      });
      // Check if the role exists
      if (_roleFromDB && _roleFromDB._id) {
        // If the role exists and is superAdmin, then update with all the permissions
        const payload: {
          permissions: string[];
          updatedBy: string;
          updatedAt: Date;
        } = {
          permissions: role.permissions,
          updatedBy: data.userId,
          updatedAt: new Date(),
        };

        await this.updateRole(_roleFromDB._id, payload);
      } else {
        const payload: PostRoleDto = role as unknown as PostRoleDto;
        payload.createdBy = data.userId;
        await this.roles.create(payload);
      }
    }
    return await this.roles.find().exec();
  }

  /**
   * Get all the permissions in the system
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationService
   */
  async getAllPermissions(): Promise<CustomHttpResponse> {
    try {
      const permissions = await this.permissions.find().exec();

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'All Permissions loaded from the database',
        permissions,
      );
    } catch (error) {
      return new CustomHttpResponse(error.statusCode, error.message, error);
    }
  }

  /**
   * Get all roles in the system
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationService
   */
  async getAllRoles(userId?: string): Promise<CustomHttpResponse> {
    try {
      let roles = await this.roles.find().exec();
      const defaultRolesData = DefaultRolesData;
      let reQuery = false;
      if (roles.length === 0) {
        for (const role of defaultRolesData) {
          const payload: PostRoleDto = role as unknown as PostRoleDto;
          payload.createdBy = userId || null;
          await this.roles.create(payload);
        }
        reQuery = true;
      }
      if (reQuery) {
        roles = await this.roles.find().exec();
      }

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'All roles Loaded',
        roles,
      );
    } catch (error) {
      return new CustomHttpResponse(error.statusCode, error.message, error);
    }
  }

  /**
   * Get role by role id
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthorizationService
   */
  async getRoleById(id: string): Promise<CustomHttpResponse> {
    try {
      const role = await this.roles.findById(id).exec();
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Role with ${id} found`,
        role,
      );
    } catch (error) {
      return new CustomHttpResponse(error.statusCode, error.message, error);
    }
  }

  /**
   * Update the role
   *
   * @param {string} id
   * @param {*} data
   * @param {string} [userId]
   * @return {*}  {Promise<any>}
   * @memberof AuthorizationService
   */
  async updateRole(id: string, data: any, userId?: string): Promise<any> {
    const filter = { _id: id };
    const payload: any = data as unknown as any;
    payload.updatedBy = userId;
    payload.updatedAt = new Date();

    // Remove the fields to be updated
    return this.roles.findOneAndUpdate(filter, payload, {
      returnOriginal: false,
    });
  }

  /**
   * Get the roles with a certain permission
   *
   * @param {{ permissions: PermissionEnum[] }} payload
   * @param {string} userId
   * @return {*}  {Promise<string[]>}
   * @memberof AuthorizationService
   */
  async getRolesWithPermissions(
    payload: { permissions: PermissionEnum[] },
    userId: string,
  ): Promise<string[]> {
    const roles = (await this.getAllRoles(userId)).data || [];
    const filteredRoles: string[] = [];
    await roles.forEach((role: RoleInterface) => {
      const hasPermissions = roles
        .join(',')
        .includes(payload.permissions.join(','));
      if (hasPermissions) {
        filteredRoles.push(role._id.toString());
      }
    });
    return filteredRoles;
  }
}
