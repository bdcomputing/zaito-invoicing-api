import { Injectable, Logger } from '@nestjs/common';
import { SMSDto } from '../dto/sms.dto';
import { SendEmailInterface } from '../interfaces/email.interface';
import { MailService } from './mail/mail.service';
import { SettingsInterface } from 'src/settings/interfaces/settings.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { TestEmailTemplate } from '../templates/test/test-mail.template';
import { SettingsService } from 'src/settings/services/settings.service';
import { SMS_PROVIDERS_ENUM } from '../enums/sms-providers.enum';
import { SmsService } from './sms/sms.service';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  /**
   * Creates an instance of NotificationsService.
   * @param {SmsService} smsService
   * @param {MailService} mailService
   * @param {WhatsappService} whatsappService
   * @param {SettingsService} settingsService
   * @memberof NotificationsService
   */
  constructor(
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly settingsService: SettingsService,
  ) {}

  /**
   * Send Test Emails
   *
   * @param {string[]} emails
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof NotificationsService
   */
  async sendTestEmails(emails: string[]): Promise<CustomHttpResponse> {
    // Get Settings from database
    const settings: SettingsInterface = (
      await this.settingsService.getSettings()
    ).data;
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      // Get User
      const mail: SendEmailInterface = {
        html: TestEmailTemplate({ settings, email }),
        recipient: email,
        textAlignment: 'left',
        hasHero: false,
        subject: `Test Email`,
      };
      await this.mailService.sendEmail(mail);
    }
    let message;
    if (emails.length > 1) {
      message = `Test emails sent to the ${emails.length} emails provided`;
    } else {
      message = `Test emails sent to the ${emails.length} email provided`;
    }
    return new CustomHttpResponse(HttpStatusCodeEnum.OK, message, null);
  }

  /**
   * Dispatch Email
   *
   * @param {SendEmailInterface} mail
   * @return {*}
   * @memberof NotificationsService
   */
  async dispatchEmail(mail: SendEmailInterface) {
    // send email to client
    try {
      return await this.mailService.sendEmail(mail);
    } catch (error) {
      this.logger.error({ 'email sending error': error });
      return;
    }
  }
  async sendTestSMS(sms: SMSDto) {
    return await this.sendSMS(sms);
  }

  async sendSMS(sms: SMSDto) {
    const provider = SMS_PROVIDERS_ENUM.ONFON as string;
    if (provider === SMS_PROVIDERS_ENUM.CELCOM) {
      return await this.smsService.sendSMSUsingCelcom(sms);
    } else if (provider === SMS_PROVIDERS_ENUM.ONFON) {
      return await this.smsService.sendSMSUsingOnfon();
    } else if (provider === SMS_PROVIDERS_ENUM.SMS_LEOPARD) {
      return await this.smsService.sendSMSUsingSMSLEOPARD();
    }
  }

  /**
   * Send Demo Whatsapp Message
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof NotificationsService
   */
  // async sendDemoWhatsAppMessage(): Promise<CustomHttpResponse> {
  //   try {
  //     const settings: SettingsInterface = (
  //       await this.settingsService.getSettings()
  //     ).data;
  //     const data = this.whatsappService.getTextMessageInput(
  //       settings.facebookApp.FACEBOOK_RECIPIENT_WAID,
  //       `Welcome to the ${appName}`,
  //     );
  //     await this.sendWhatsAppMessage(data);
  //     return new CustomHttpResponse(
  //       HttpStatusCodeEnum.OK,
  //       'Message Sent Successfully',
  //       null,
  //     );
  //   } catch (error) {
  //     this.logger.error(error);
  //     return new CustomHttpResponse(
  //       HttpStatusCodeEnum.BAD_REQUEST,
  //       'Message Sending Failed',
  //       error,
  //     );
  //   }
  // }

  /**
   * Send Whatsapp Message
   *
   * @param {*} data
   * @return {*}
   * @memberof NotificationsService
   */
  // async sendWhatsAppMessage(data: any) {
  //   try {
  //     const settings: SettingsInterface = await (
  //       await this.settingsService.getSettings()
  //     ).data;
  //     return this.whatsappService.sendMessage(data, settings.facebookApp);
  //   } catch (error) {
  //     this.logger.error({ error });
  //     return error;
  //   }
  // }
}
