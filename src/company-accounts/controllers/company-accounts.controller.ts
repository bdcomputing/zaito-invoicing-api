import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { CreateCompanyAccountDto } from 'src/company-accounts/dto/create-company-account.dto';
import { UpdateCompanyAccountDto } from 'src/company-accounts/dto/update-company-account.dto';
import { CompanyAccountsService } from 'src/company-accounts/services/company-accounts.service';
import { CustomHttpResponse } from 'src/shared';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@Controller('company-accounts')
export class CompanyAccountsController {
  /**
   * The constructor for the CompanyAccountsController
   *
   * @param {CompanyAccountsService} companyAccountsService The CompanyAccountsService
   * @memberof CompanyAccountsController
   */
  constructor(
    private readonly companyAccountsService: CompanyAccountsService,
  ) {}

  /**
   * Register a new Company Account
   *
   * @param {CreateCompanyAccountDto} createCompanyAccountDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof CompanyAccountsController
   */
  @Post()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.CREATE_COMPANY_ACCOUNT)
  async create(
    @Body() createCompanyAccountDto: CreateCompanyAccountDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    // create company account
    const response = await this.companyAccountsService.create(
      createCompanyAccountDto,
      userId,
    );
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all Company Accounts
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof CompanyAccountsController
   */
  @Get()
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_COMPANY_ACCOUNTS)
  async findAll(
    @Query() query: ExpressQuery,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get all company accounts
    const response = await this.companyAccountsService.findAll(query);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Find a Company Account using ID
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof CompanyAccountsController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.VIEW_COMPANY_ACCOUNT)
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get company account by Id
    const response = await this.companyAccountsService.findOne(id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update Company Account
   *
   * @param {string} id
   * @param {UpdateCompanyAccountDto} updateExpenseDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof CompanyAccountsController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_COMPANY_ACCOUNT)
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateCompanyAccountDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    // Update company account
    const response = await this.companyAccountsService.update(
      id,
      updateExpenseDto,
      userId,
    );
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Remove Company Account
   *
   * @param {string} id
   * @return {*}
   * @memberof CompanyAccountsController
   */
  @Delete(':id')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.DELETE_COMPANY_ACCOUNT)
  remove(@Param('id') id: string) {
    // TODO: set response status code
    return this.companyAccountsService.remove(id);
  }
}
