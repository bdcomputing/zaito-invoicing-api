import { SettingsService } from './../../settings/services/settings.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { FileUploadedResponseDto } from 'src/file-manager/google-cloud-storage/dtos/file-uploaded.dto';
import { GCSFileResponseInterface } from 'src/file-manager/google-cloud-storage/interfaces/gcs-file.interface';
import { EmployeeAccountCreatedEmailTemplate } from 'src/notifications/templates/employee/account-created.template';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { SendEmailInterface } from 'src/notifications/interfaces/email.interface';
import { RoleInterface } from 'src/authorization/interfaces/roles.interface';
import { RolesEnum } from 'src/authorization/data/default-roles.data';
import { RegisterEmployeeDto } from 'src/users/dto/register-employee.dto';
import { generatePassword } from 'src/shared/utils/password-generator.util';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { SuperUserAccountCreatedEmailTemplate } from 'src/notifications/templates/admins/super-user-account-created.template';
import { PasswordResetLinkTemplate } from 'src/auth/email-templates/password-reset-link.template';
import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { ConfigService } from '@nestjs/config';
import { SyncSuperAdminDto } from 'src/setup/dto/sync-db.dto';
import { DefaultNotificationSubscriptions } from 'src/notifications/data/default-subscriptions.data';
import { appName } from 'src/shared/constants/constants';
import { UsersService } from './users.service';
import { AuthorizationService } from 'src/authorization/services/authorization.service';
import { CreateAuthLogDto } from '../../logger/dto/auth-log.dto';
import { generatePasswordResetCode } from 'src/auth/utils/auto-generate-password-reset-code';
import { AccountCreatedPatientEmailTemplate } from 'src/patients/email-templates/account-created.template';
import { PasswordResetOTPTemplate } from 'src/auth/email-templates/password-reset-otp.template';
import { OtpService } from 'src/otp/services/otp.service';
import { OTPInterface } from 'src/otp/interfaces/otp.interface';
import { OTPUseEnum } from 'src/otp/enums/otp-use.enum';
import { GeneratePasswordResetOTPHelper } from 'src/shared/helpers/generate-otp.helper';
import { PasswordResetSuccessEmailTemplate } from 'src/auth/email-templates/password-reset-success.template';
@Injectable()
export class UserAutomationService {
  private logger = new Logger(UserAutomationService.name);
  /**
   * Creates an instance of UserAutomationService.
   
   * @param {Model<UserInterface>} user
   * @param {NotificationsService} notificationsService
   * @param {AuthorizationService} authorizationService
   * @param {UsersService} usersService
   * @param {EventEmitter2} eventEmitter
   * @param {ConfigService} configService
   * @memberof UserAutomationService
   */
  constructor(
    @Inject(DatabaseModelEnums.USER_MODEL)
    private readonly user: Model<UserInterface>,
    private readonly notificationsService: NotificationsService,
    private readonly settingsService: SettingsService,
    private readonly authorizationService: AuthorizationService,
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * Attach Signature to the user/staff
   *
   * @param {FileUploadedResponseDto} data
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.SignatureUploaded, { async: true })
  async addSignatureToUserData(
    data: FileUploadedResponseDto,
  ): Promise<CustomHttpResponse> {
    try {
      const filter = { _id: data.payload.reference };
      const payload: {
        signature: GCSFileResponseInterface;
        updatedBy: string;
        updatedAt: Date;
      } = {
        signature: data.metadata,
        updatedBy: data.userId,
        updatedAt: new Date(),
      };

      const updateRes = await this.user.findOneAndUpdate(filter, payload, {
        returnOriginal: false,
      });

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Signature Uploaded successfully!',
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
   * Send email to clinic on account created
   *
   * @param {{
   *     settings: any;
   *     user: UserInterface;
   *   }} payload
   * @memberof UsersController
   */
  @OnEvent(SystemEventsEnum.UserAccountCreated, { async: true })
  sendEmailOnUserRegisterEvent(payload: {
    settings: any;
    user: UserInterface;
  }) {
    const { user, settings } = payload;
    const { isBackOfficeUser, patientId } = user;

    const accountType =
      !isBackOfficeUser && patientId
        ? 'Clinic Account'
        : !isBackOfficeUser && patientId
        ? 'Patient Account'
        : 'Employee Account';
    // prepare the payload
    const mail: SendEmailInterface = {
      html: isBackOfficeUser
        ? { template: '' }
        : AccountCreatedPatientEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `${accountType} Created Successfully`,
    };
    this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Attach password reset code to user when auth log is created
   * @param {CreateAuthLogDto} authLog
   * @returns {Promise<void>}
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.AddAuthLog, { async: true })
  async attachPasswordResetCode(authLog: CreateAuthLogDto) {
    const { userId } = authLog;
    if (userId) {
      // const passwordResetCode: string = generatePasswordResetCode(userId);
      // await this.user
      //   .findOneAndUpdate({ _id: userId }, { passwordResetCode })
      //   .exec();
    }
  }

  /**
   * Send email to new Employee on Account created
   *
   * @param {{ settings: any; user: any }} payload
   * @memberof UsersController
   */
  @OnEvent(SystemEventsEnum.EmployeeAccountCreated, { async: true })
  sendEmailOnEmployeeRegisterEvent(payload: { settings: any; user: any }) {
    const { user, settings } = payload;
    const mail: SendEmailInterface = {
      html: EmployeeAccountCreatedEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: ` Welcome to ${appName}! 🚀 Your Onboarding Journey Begins!`,
    };
    this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Syncs the super admin user account on startup.
   * - Gets the admin role ID.
   * - Generates a random password.
   * - Creates a new employee user with admin role.
   * - Hashes the password.
   * - Checks if email/phone already exists.
   * - Saves the new user.
   * - Emits events to notify of new super user and sync their DB.
   * - Returns a response.
   */
  async syncAdminUser(payload: SyncSuperAdminDto): Promise<CustomHttpResponse> {
    try {
      // Get the id of the admin role
      const roles: RoleInterface[] = (
        await this.authorizationService.getAllRoles()
      ).data;

      if (roles.length > 0) {
        const role: RoleInterface = roles.find((ro: RoleInterface) => {
          return ro.role === RolesEnum.SuperAdminRole;
        });

        // Get the role ID
        const roleID = role._id.toString();

        // generate a random password for the user
        const password: string = payload.password
          ? payload.password
          : generatePassword({ includeSpecialChars: true });

        // Prepare the employee payload
        const newEmployee: RegisterEmployeeDto = {
          name: payload.name ? payload.name : 'Admin',
          email: payload.email,
          password,
          phone: payload.phone,
          role: roleID,
        };
        // Check whether the email provided has been used
        const { email, name, phone } = newEmployee;

        const users = await this.usersService.findAll();

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

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = {
          notifications: DefaultNotificationSubscriptions,
          password: hashedPassword,
          email: email.toLowerCase(),
          phone: phone,
          name: name,
          phoneVerified: false,
          isBackOfficeUser: true,
          role: roleID,
        };
        const res = await this.user.create(newUser);

        const user = newUser;
        user.password = password;

        // sync database
        this.eventEmitter.emit(
          SystemEventsEnum.SyncDatabase,
          res._id.toString(),
        );

        /**
         * Emits a SuperUserAccountCreated event with the settings and user data.
         * This notifies other parts of the system that a new super user account has been created.
         */
        this.eventEmitter.emit(SystemEventsEnum.SuperUserAccountCreated, {
          user: user,
        });

        return new CustomHttpResponse(
          HttpStatusCodeEnum.CREATED,
          `Super User was created successfully!`,
          res,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Listens for the SuperUserAccountCreated system event.
   * Sends an email notification when a new super user account is created.
   *
   * @param payload - Contains the new super user account data
   */

  @OnEvent(SystemEventsEnum.SuperUserAccountCreated, { async: true })
  sendEmailOnSuperUserRegisterEvent(payload: { user: RegisterEmployeeDto }) {
    const { user } = payload;
    const mail: SendEmailInterface = {
      html: SuperUserAccountCreatedEmailTemplate(user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `User Account Created Successfully`,
    };
    this.notificationsService.dispatchEmail(mail);
  }

  @OnEvent(SystemEventsEnum.PasswordResetRequested, { async: true })
  async sendPasswordResetEmail(payload: {
    user: UserInterface;
    settings: SettingsInterface;
    useOTP: boolean;
  }) {
    const { user, settings, useOTP } = payload;
    const frontendRootURL =
      this.configService.get('FRONTEND_URL') || settings.appURL;
    const resetLink = `${frontendRootURL}/auth/update-password/${user.resetPasswordToken.toString()}`;

    const mail: SendEmailInterface = {
      html: PasswordResetLinkTemplate(settings, user, resetLink),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `Your Password Reset Link is Here`,
    };
    if (useOTP) {
      const { code, expiry } = GeneratePasswordResetOTPHelper();
      const otp: OTPInterface = await this.otpService.generatePasswordResetOTP({
        otp: {
          code,
          email: user.email,
          token: user.resetPasswordToken.toString(),
          use: OTPUseEnum.PASSWORD_RESET,
          expiry,
        },
        userId: user._id.toString(),
      });
      mail.html = PasswordResetOTPTemplate(settings, user, otp);
      mail.subject = `Your Password Reset OTP is Here`;
    }

    this.notificationsService.dispatchEmail(mail);
  }

  /**
   * Send email to user on password reset success
   *
   * @param {UserInterface} user
   * @memberof UserAutomationService
   */
  @OnEvent(SystemEventsEnum.PASSWORD_RESET_SUCCESS, { async: true })
  async sendPasswordResetSuccessEmail(user: UserInterface) {
    const settings: SettingsInterface = (
      await this.settingsService.getSettings()
    ).data;

    const mail: SendEmailInterface = {
      html: PasswordResetSuccessEmailTemplate(settings, user),
      recipient: user.email,
      textAlignment: 'left',
      hasHero: false,
      subject: `Your Password was Changed`,
    };

    this.notificationsService.dispatchEmail(mail);
  }

  @OnEvent(SystemEventsEnum.PASSWORD_RESET_SUCCESS, { async: true })
  @OnEvent(SystemEventsEnum.UserCreated, { async: true })
  @OnEvent(SystemEventsEnum.SuperUserAccountCreated, {
    async: true,
  })
  async setPasswordResetToken(user: UserInterface) {
    const passwordResetCode: string = generatePasswordResetCode(user._id);

    await this.user.findByIdAndUpdate(user._id, {
      passwordResetCode,
    });
  }

  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async addDefaultNotificationSubscriptions() {
    const users = (await this.user.find().exec()) || [];

    for (let index = 0; index < users.length; index++) {
      const user = users[index];

      if (user && user.notifications && user.notifications.length > 0) {
        continue;
      } else {
        const filter = { _id: user._id.toString() };
        await this.user.findOneAndUpdate(
          filter,
          { notifications: DefaultNotificationSubscriptions },
          { returnOriginal: false },
        );
        continue;
      }
    }
  }
}
