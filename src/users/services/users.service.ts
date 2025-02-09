import { RolesService } from './../../authorization/services/roles.service';
import { Global, Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { DefaultNotificationSubscriptions } from 'src/notifications/data/default-subscriptions.data';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { hashPassword } from 'src/shared/helpers/hash-password.helper';
import { User } from 'src/users/interfaces/user.interface';
import { AuthorizationService } from '../../authorization/services/authorization.service';
import { SettingsService } from '../../settings/services/settings.service';
import {
  PostNewEmployeeDto,
  RegisterEmployeeDto,
} from '../dto/register-employee.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PaginatedData } from 'src/database/interfaces/paginated-data.interface';
import { PrepareEmployeeAggregation } from 'src/users/helpers/employee-aggregator.helper';
import { Role } from 'src/authorization/interfaces/roles.interface';
import {
  ManageMagicLoginDto,
  PostMagicLoginStatusDto,
} from '../dto/update-magic-login.dto';
import {
  DefaultShippingAddressDto,
  PostDefaultShippingAddressStatusDto,
} from '../dto/update-shipping-address.dto';

@Global()
@Injectable()
export class UsersService {
  /**
   * Creates an instance of UsersService.
   * @param {Model<User>} user
   * @param {SettingsService} settings
   * @param {AuthorizationService} authorizationService
   * @param {RolesService} rolesService
   * @param {EventEmitter2} eventEmitter
   * @memberof UsersService
   */
  constructor(
    @Inject(DatabaseModelEnums.USER_MODEL) private user: Model<User>,
    private readonly settings: SettingsService,
    private readonly authorizationService: AuthorizationService,
    private readonly rolesService: RolesService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Get all users from the database
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersService
   */
  async getAllUsers(): Promise<CustomHttpResponse> {
    try {
      const users = await this.user.find({ isActive: true }).exec();
      // If the users list is empty
      if (!users.length) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.OK,
          'There are no Users found',
          users,
        );
      }
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Users found',
        users,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the users',
        error,
      );
    }
  }
  /**
   * Create a user account
   * @param RegisterIndividualClinicDto - The user data to create an account
   * @returns Promise<CustomHttpResponse>
   */
  async create(userDto: RegisterUserDto): Promise<CustomHttpResponse> {
    const { password, email, name, phone, clinicId, patientId } = userDto;
    const users = await this.findAll();
    if (users) {
      const emailExist = _.find(users, ['email', email]);

      // confirm Email
      if (emailExist) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The email you have provided already exists',
          null,
        );
      }

      // confirm phone
      const phoneExist = _.find(users, ['phone', phone]);

      if (phoneExist) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The phone number you have provided already exists',
          null,
        );
      }
    }
    const hashedPassword = await hashPassword(password);
    const role: Role | undefined = await this.rolesService.getClinicRole();

    // create user
    const user = await this.user.create({
      password: hashedPassword,
      email: email.toLowerCase(),
      phone: phone,
      name: name,
      role: role ? role._id.toString() : undefined,
      phoneVerified: false,
      notifications: DefaultNotificationSubscriptions,
      clinicId,
      patientId,
    });
    // Get settings
    const settings = (await this.settings.getSettings()).data;
    user.password = password;

    // Emit the event that the user has been created
    this.eventEmitter.emit(SystemEventsEnum.UserAccountCreated, {
      settings,
      user,
    });

    return new CustomHttpResponse(
      HttpStatusCodeEnum.CREATED,
      `Hey ${user.name}, your user account was created successfully!`,
      user,
    );
  }

  /**
   * Register a employee Account
   *
   * @param {RegisterEmployeeDto} employeeDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersService
   */
  async registerEmployee(
    employeeDto: RegisterEmployeeDto,
    createdBy: string,
  ): Promise<CustomHttpResponse> {
    const { password, email, name, phone, role } = employeeDto;
    const users = await this.findAll();

    if (users) {
      const emailExist = _.find(users, ['email', email]);

      // confirm Email
      if (emailExist) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The email you have provided already exists',
          null,
        );
      }

      // confirm phone
      const phoneExist = _.find(users, ['phone', phone]);

      if (phoneExist) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.BAD_REQUEST,
          'The phone number you have provided already exists',
          null,
        );
      }
    }
    // Hash the user Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Prepare Employee Data
    const employee: PostNewEmployeeDto = {
      password: hashedPassword,
      email: email.toLowerCase(),
      phone: phone,
      name: name,
      phoneVerified: true,
      isBackOfficeUser: false,
      role,
      isPasswordDefault: false,
      createdBy,
    };
    const user = await this.user.create(employee);

    user.password = password;

    const settings = (await this.settings.getSettings()).data;
    // Emit an event that the employee has been created

    this.eventEmitter.emit(SystemEventsEnum.EmployeeAccountCreated, {
      settings,
      user,
    });

    return new CustomHttpResponse(
      HttpStatusCodeEnum.CREATED,
      `Employee account was created successfully!`,
      user,
    );
  }

  /**
   * Get a user using their email
   *
   * @param {string} id
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  async findOne(id: string): Promise<User> {
    const user: User = await this.user.findOne({
      _id: id,
      isActive: true,
    });
    return Promise.resolve(user);
  }
  async findByPatientId(patientId: string): Promise<User> {
    const user: User = await this.user.findOne({
      patientId,
    });
    return Promise.resolve(user);
  }
  /**
   * Get a user using their email
   *
   * @param {string} email
   * @return {*}
   * @memberof UsersService
   */
  async getUserUsingEmail(email: string): Promise<CustomHttpResponse> {
    try {
      const userQuery = await this.user
        .aggregate([
          {
            $match: {
              email: email.toLowerCase(),
            },
          },
          {
            $addFields: {
              rlId: {
                $toObjectId: '$role',
              },
            },
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'rlId',
              foreignField: '_id',
              as: 'role',
            },
          },
          {
            $unwind: '$role',
          },
        ])
        .exec();
      const user: any = userQuery[0] || undefined;

      if (_.isEmpty(user)) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          'The user record not found',
          null,
        );
      } else {
        const data = {
          user,
          clinic: null,
          permissions: [],
        };

        if (user.role) {
          const role = await this.authorizationService.getRoleById(
            user.role._id.toString(),
          );
          data.permissions = role.data.permissions;
        }

        return new CustomHttpResponse(
          HttpStatusCodeEnum.OK,
          'User found',
          data,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the user',
        error,
      );
    }
  }

  /**
   * Get a user by their ID.
   *
   * This method finds a user by their ID, and returns
   * a response with the user data, related clinic if applicable,
   * and permissions based on the user's role.
   *
   * It handles cases where the user is not found, and any errors.
   */
  async getUserUsingId(id: string): Promise<CustomHttpResponse> {
    try {
      const user = await this.user.findById(id);

      if (_.isEmpty(user)) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          'The user record not found',
          null,
        );
      } else {
        const data = {
          user,
          clinic: null,
          permissions: [],
        };
        if (user.role) {
          const role = (await this.authorizationService.getRoleById(user.role))
            .data;

          data.permissions = role ? role.permissions : [];
        }

        return new CustomHttpResponse(
          HttpStatusCodeEnum.OK,
          'user data found',
          data,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the user',
        error,
      );
    }
  }
  /**
   * Gets users with the specified role.
   *
   * @param role - The role to find users for.
   * @returns A CustomHttpResponse containing the found users.
   */
  async getUsersUsingRole(role: string): Promise<CustomHttpResponse> {
    try {
      const users = await this.user.find({ role });

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Users with the role found',
        users,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the users',
        error,
      );
    }
  }

  /**
   * Get a user using their phone
   *
   * @param {string} phone
   * @return {*}
   * @memberof UsersService
   */
  async getUserUsingPhone(phone: string): Promise<CustomHttpResponse> {
    try {
      const user = await this.user.findOne({ phone });

      if (_.isEmpty(user)) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.NOT_FOUND,
          'The user record not found',
          null,
        );
      } else {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.OK,
          'User record found',
          user,
        );
      }
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the user',
        error,
      );
    }
  }

  /**
   * Get a user using their user id
   *
   * @param {string} email
   * @return {*}
   * @memberof UsersService
   */
  async findByEmail(email: string): Promise<CustomHttpResponse> {
    return this.getUserUsingEmail(email);
  }

  /**
   *
   * Update a user
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async update(
    id: string,
    data: any,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: any = data as unknown as any;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const updateRes = await this.user.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'User records updated',
        updateRes,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error.messages,
      );
    }
  }

  /**
   *
   * Manage Magic Login
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async manageMagicLogin(
    id: string,
    data: ManageMagicLoginDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: PostMagicLoginStatusDto = data as PostMagicLoginStatusDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const user = await this.user.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Magic Login ${data.magicLogin ? 'enabled' : 'disabled'} successfully!`,
        user,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error.messages,
      );
    }
  }

  /**
   *
   * Update Default Shipping Address
   * @param {string} id
   * @param {*} payload
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  async updateShippingAddress(
    id: string,
    data: DefaultShippingAddressDto,
    userId: string,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: id };
      const payload: PostDefaultShippingAddressStatusDto =
        data as PostDefaultShippingAddressStatusDto;
      payload.updatedBy = userId;
      payload.updatedAt = new Date();

      const user = await this.user.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Default Shipping Address updated successfully!`,
        user,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        error.message,
        error.messages,
      );
    }
  }

  /**
   * Find all users in the system
   *
   * @return {*}  {Promise<User[]>}
   * @memberof UsersService
   */
  async findAll(): Promise<User[]> {
    return this.user.find().exec();
  }

  /**
   * Get all employees from the database
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersService
   */
  async getAllEmployees(query?: ExpressQuery): Promise<CustomHttpResponse> {
    try {
      const limitQ = (query && query.limit) || 50;
      const totalDocuments = (await this.user.find().countDocuments()) || 0;

      const limit = +limitQ === -1 ? totalDocuments : +limitQ;
      const keyword = query && query.keyword ? query.keyword : '';
      const page = query && query.page ? +query.page : 1;
      const skip = limit * (page - 1);
      const sort =
        query && query.sort ? { ...(query.sort as any) } : { name: 1 };

      const aggregation = PrepareEmployeeAggregation({
        keyword: keyword as string,
        sort,
        limit,
        skip,
      });

      const employees = await this.user.aggregate(aggregation).exec();
      const counts = await this.user
        .aggregate([...aggregation.slice(0, -2), { $count: 'count' }])
        .exec();

      const total = counts[0].count;

      const pages = Math.ceil(total / limit);

      const response: PaginatedData = {
        page,
        limit,
        total,
        data: employees,
        pages,
      };

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Employee List loaded successfully',
        response,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'There was an error getting the employees',
        error.messages,
      );
    }
  }
}
