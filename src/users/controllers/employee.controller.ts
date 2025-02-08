import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { RegisterEmployeeDto } from 'src/users/dto/register-employee.dto';
import { UpdateEmployeeDto } from 'src/users/dto/update-employee.dto';
import { UsersService } from 'src/users/services/users.service';
import { Query as ExpressQuery } from 'express-serve-static-core';

@ApiTags('Employee')
@Controller('employees')
export class EmployeeController {
  /**
   * Creates an instance of EmployeeController.
   * @param {UsersService} usersService
   * @memberof EmployeeController
   */
  constructor(private usersService: UsersService) {
    //
  }

  /**
   * Register an employee Account
   *
   * @param {RegisterEmployeeDto} employeeDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof EmployeeController
   */
  @Post()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.CREATE_EMPLOYEE)
  @ApiOperation({ description: 'Register Employee' })
  async create(
    @Body() employeeDto: RegisterEmployeeDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const createdBy: string = req.user._id.toString();
    // register employee
    const response = await this.usersService.registerEmployee(
      employeeDto,
      createdBy,
    );
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all employees
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof EmployeeController
   */
  @Get()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_EMPLOYEES)
  async getEmployees(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get all employees
    const response = await this.usersService.getAllEmployees(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get Employee information by ID
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof EmployeeController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_EMPLOYEE)
  async getUserById(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get employee information by id
    const response = await this.usersService.getUserUsingId(id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update Employee Account
   *
   * @param {string} id
   * @param {UpdateEmployeeDto} payload
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof EmployeeController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_EMPLOYEE)
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeeDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId: string = req.user._id;
    const response = await this.usersService.update(id, payload, userId);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
