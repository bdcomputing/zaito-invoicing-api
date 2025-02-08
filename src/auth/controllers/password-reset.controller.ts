import { PasswordService } from './../../users/services/passwords.service';
import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomHttpResponse } from 'src/shared';
import {
  UpdatePasswordDto,
  UpdatePasswordWithOTPDto,
  UpdatePasswordWithTokenDto,
} from 'src/users/dto/update-password.dto';
import { ResetPasswordDTO } from '../dtos/reset-password.dto';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { UsersService } from 'src/users/services/users.service';
@ApiTags('Authentication')
@Controller('auth/password')
export class PasswordResetController {
  /**
   * Creates an instance of PasswordResetController.
   * @param {AuthService} authService
   * @param {UsersService} usersService
   * @memberof PasswordResetController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly passwordService: PasswordService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Request a password reset link
   *
   * @param {ResetPasswordDTO} payload
   * @param {GenericResponse} res
   * @return {*}
   * @memberof PasswordResetController
   */
  @Post('reset')
  async resetPassword(
    @Body() payload: ResetPasswordDTO,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.passwordService.resetPassword(payload);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Update user password
   *
   * @param {UpdatePasswordDto} updatePasswordDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthController
   */
  @Post('update/:passwordResetCode')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('passwordResetCode') passwordResetCode: string,
  ): Promise<CustomHttpResponse> {
    return await this.passwordService.processUpdatePasswordWhenLoggedIn({
      passwordResetCode,
      updatePasswordDto,
    });
  }

  /**
   * Update the Password with token
   *
   * @param {UpdatePasswordWithTokenDto} updatePasswordDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PasswordResetController
   */
  @Post('update')
  async updatePasswordWithToken(
    @Body() updatePasswordDto: UpdatePasswordWithTokenDto,
  ): Promise<CustomHttpResponse> {
    return await this.passwordService.processUpdatePasswordWithToken(
      updatePasswordDto,
    );
  }

  /**
   * Update the Password with OTP
   *
   * @param {UpdatePasswordWithOTPDto} updatePasswordDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PasswordResetController
   */
  @Post('update-with-otp')
  async updatePasswordUsingOTP(
    @Body() updatePasswordDto: UpdatePasswordWithOTPDto,
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = await this.passwordService.processUpdatePasswordWithOTP(
      updatePasswordDto,
    );
    res.setStatus(response.statusCode);
    return response;
  }
  /**
   * Get the User using Password Reset token
   *
   * @param {UpdatePasswordWithTokenDto} updatePasswordDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof PasswordResetController
   */
  @Get('user')
  async getUserUsingToken(
    @Body() { token }: { token: string },
  ): Promise<CustomHttpResponse> {
    return await this.passwordService.getUserUsingResetPasswordToken(token);
  }
}
