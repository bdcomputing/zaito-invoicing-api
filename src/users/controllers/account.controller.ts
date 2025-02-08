import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { ManageMagicLoginDto } from '../dto/update-magic-login.dto';
import { UserInterface } from '../interfaces/user.interface';
import { AuthLogsService } from 'src/logger/services/auth-logs.service';
import { DefaultShippingAddressDto } from '../dto/update-shipping-address.dto';

@Controller('account')
export class AccountController {
  /**
   * Creates an instance of AccountController.
   * @param {UsersService} usersService
   * @param {AuthLogsService} authLogsService
   * @memberof AccountController
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly authLogsService: AuthLogsService,
  ) {
    //
  }

  /**
   * Get user account for the logged in user
   *
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Get('')
  @UseGuards(AuthenticationGuard)
  async getMyAccount(
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const user = req.user;
    const { email } = user;
    // get user account
    const response = await this.usersService.getUserUsingEmail(email);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update magic link status
   *
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Patch('magic-login')
  @UseGuards(AuthenticationGuard)
  async updateMagicLogin(
    @Req() req: any,
    @Body() body: ManageMagicLoginDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const user: UserInterface = req.user;
    const { _id } = user;
    // update magic login status
    const response = await this.usersService.manageMagicLogin(_id, body, _id);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update magic link status
   *
   * @param {*} req
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UsersController
   */
  @Patch('shipping-address')
  @UseGuards(AuthenticationGuard)
  async updateDefaultShippingAddress(
    @Req() req: any,
    @Body() body: DefaultShippingAddressDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const user: UserInterface = req.user;
    const { _id } = user;
    // update shipping address
    const response = await this.usersService.updateShippingAddress(
      _id,
      body,
      _id,
    );
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  @Get('auth-logs')
  @UseGuards(AuthenticationGuard)
  async getMyAuthLogs(
    @Req() req: any,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const user = req.user;
    const { email } = user;
    const payload: { email } = { email };
    // get user account
    const response = await this.authLogsService.getAllAuthLogs(payload);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
