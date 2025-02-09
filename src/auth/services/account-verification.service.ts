import { Injectable } from '@nestjs/common';
import { SendEmail } from 'src/notifications/interfaces/email.interface';
import {
  AccountVerificationCodeOTPDto,
  GenerateOTPDto,
} from 'src/otp/dto/generate-otp.dto';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { GenerateOTPHelper } from 'src/shared/helpers';
import { User } from 'src/users/interfaces/user.interface';
import { ValidateOTPDto } from '../dtos/validate-otp.dto';
import { UsersService } from '../../users/services/users.service';
import { OtpService } from '../../otp/services/otp.service';
import { SettingsService } from '../../settings/services/settings.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { AccountVerificationOTPTemplate } from '../email-templates/account-verification-otp.template';
import { OTPUseEnum } from 'src/otp/enums/otp-use.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';

@Injectable()
export class AccountVerificationService {
  /**
   * Creates an instance of AccountVerificationService.
   * @param {UsersService} usersService
   * @param {OtpService} otpService
   * @param {SettingsService} settingsService
   * @param {NotificationsService} notificationsService
   * @param {EventEmitter2} eventEmitter
   * @memberof AccountVerificationService
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly settingsService: SettingsService,
    private readonly notificationsService: NotificationsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  /**
   * Generate OTP Code to validate user Account
   *
   * @param {User} user
   * @memberof AuthService
   */
  async requestOTP(user: User): Promise<CustomHttpResponse> {
    try {
      const otp: GenerateOTPDto = GenerateOTPHelper(user);
      // generate the payload
      const payload: AccountVerificationCodeOTPDto = {
        code: otp.code,
        email: user.email,
        use: OTPUseEnum.EMAIL_VERIFICATION,
        expiry: otp.expiry,
      };

      const otpResponse = await this.otpService.saveAccountVerificationCode({
        otp: payload,
        userId: user._id.toString(),
      });

      // Add the OTP ID to the users records
      await this.usersService.update(
        user._id,
        {
          otpId: otpResponse._id,
        },
        user._id.toString(),
      );
      // Send out the notification
      const settings = (await this.settingsService.getSettings()).data;

      // prepare the email
      const mail: SendEmail = {
        html: AccountVerificationOTPTemplate(settings, user, otpResponse),
        recipient: user.email,
        hasHero: false,
        subject: `Account Verification Code Generated`,
      };
      this.notificationsService
        .dispatchEmail(mail)
        .then(() => {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.OK,
            `Hey ${user.name}, Your OTP Code has been sent successfully!`,
            null,
          );
        })
        .catch((error: any) => {
          return new CustomHttpResponse(
            HttpStatusCodeEnum.BAD_REQUEST,
            `Hey ${user.name}, There was an issue sending your OTP Message`,
            error,
          );
        });
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Hey ${user.name}, Your OTP Code has been sent successfully!`,
        null,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `Hey ${user.name}, There was an issue sending your OTP Message`,
        error,
      );
    }
  }

  /**
   * Validate OTP
   *
   * @param {UserDto} user
   * @param {ValidateOTPDto} validateOTPDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthService
   */
  async validateOTP(data: {
    user: User;
    body: ValidateOTPDto;
  }): Promise<CustomHttpResponse> {
    const { body } = data;
    let { user } = data;
    const { code } = body;
    const serverQuery = await this.otpService.findById(user.otpId);

    if (!serverQuery) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'The OTP you have provided is invalid',
        null,
      );
    }
    const serverOTP: string = serverQuery.code || '';

    const userId: string = user._id.toString();

    if (serverOTP === code && serverQuery.isActive) {
      // validate user phone
      user = await (
        await this.usersService.update(
          userId,
          {
            emailVerified: true,
            verified: true,
            otpId: null,
          },
          userId,
        )
      ).data;

      // Set OTP as used
      await this.otpService.update(
        serverQuery._id,
        {
          isActive: false,
        },
        userId,
      );

      // Emit the event that the otp has been used
      this.eventEmitter.emit(SystemEventsEnum.OTP_USED, serverQuery);

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'You have verified your account successfully',
        user,
      );
    } else {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'The OTP you have provided is invalid',
        null,
      );
    }
  }
}
