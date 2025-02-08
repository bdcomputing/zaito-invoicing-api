import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateOTPDto } from '../dtos/validate-otp.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AccountVerificationService } from '../services/account-verification.service';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@ApiTags('Account Verification')
@Controller('auth/account/verification')
export class AccountVerificationController {
  /**
   * Creates an instance of AccountVerificationController.
   * @param {AuthService} authService
   * @memberof AccountVerificationController
   */
  constructor(
    private readonly accountVerificationService: AccountVerificationService,
  ) {}

  /**
   * Request Account Verification OTP Code
   *
   * @param {*} req
   * @return {*}
   * @memberof AccountVerificationController
   */
  @Post('request-otp')
  @UseGuards(AuthenticationGuard)
  async requestOTP(@Req() req: any, @GenericResponse() res: GenericResponse) {
    const user = req.user;

    const response = await this.accountVerificationService.requestOTP(user);

    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Validate Account Verification OTP Code
   *
   * @param {*} req
   * @param {body} validateOTPDto
   * @return {*}
   * @memberof AccountVerificationController
   */
  @Post('validate-otp')
  @UseGuards(AuthenticationGuard)
  async validateOTP(
    @Req() req: any,
    @Body() body: ValidateOTPDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const user = req.user;

    const response = await this.accountVerificationService.validateOTP({
      user,
      body,
    });

    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
