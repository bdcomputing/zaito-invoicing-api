import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BankAccountsService } from '../services/bank-accounts.service';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { AuthorizationGuard } from 'src/authorization/guards/authorization.guard';
import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  /**
   * Register a new Bank Account
   *
   * @param {CreateBankAccountDto} createBankAccountDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BankAccountsController
   */
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.CREATE_BANK_ACCOUNT)
  async create(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    // create bank account
    const response = await this.bankAccountsService.create(
      createBankAccountDto,
      userId,
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all Bank Accounts
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BankAccountsController
   */
  @Get()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_BANK_ACCOUNTS)
  async findAll(
    @Query('accountType') accountType: string,
    @Query('holderId') holderId: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get all accounts
    const response = await this.bankAccountsService.findAll({
      accountType,
      holderId,
    });
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Find a Bank Account using ID
   *
   * @param {string} id
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BankAccountsController
   */
  @Get(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.VIEW_BANK_ACCOUNT)
  async findOne(
    @Param('id') id: string,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = await this.bankAccountsService.findOne(id);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update Bank Account
   *
   * @param {string} id
   * @param {UpdateBankAccountDto} updateExpenseDto
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof BankAccountsController
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_BANK_ACCOUNT)
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateBankAccountDto,
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const userId = req.user._id.toString();
    // Update bank account
    const response = await this.bankAccountsService.update(
      id,
      updateExpenseDto,
      userId,
    );
    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Remove Bank Account
   *
   * @param {string} id
   * @return {*}
   * @memberof BankAccountsController
   */
  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @RequiredPermissions(PermissionEnum.DELETE_BANK_ACCOUNT)
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(id);
  }
}
