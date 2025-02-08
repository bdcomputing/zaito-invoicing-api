import { Injectable, Logger, Req, Res } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Readable } from 'nodemailer/lib/xoauth2';
import * as puppeteer from 'puppeteer';
import { SystemEventsEnum } from './events/enums/events.enum';
import { CustomHttpResponse } from './shared';
import { HttpStatusCodeEnum } from './shared/enums/status-codes.enum';
import { NotificationsService } from './notifications/services/notifications.service';
import { SendEmailInterface } from './notifications/interfaces/email.interface';
import { ReleasesDto } from './shared/dto/releases.dto';
import { appName } from './shared/constants/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  /**
   * Creates an instance of AppService.
   * @param {EventEmitter2} eventEmitter
   * @param {AuthorizationService} authorizationService
   * @param {UsersService} usersService
   * @param {UserAutomationService} usersAutomationService
   * @param {SettingsService} settingsService
   * @param {NotificationsService} notificationsService
   * @param {PaymentAutomationService} paymentAutomationService
   * @param {ConfigService} configService
   * @memberof AppService
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   * Returns the default api response
   *
   * @return {*}  {string}
   * @memberof AppService
   */
  async healthStatus(): Promise<CustomHttpResponse> {
    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      `Welcome to ${appName}. The API is running okay`,
      {
        time: new Date(),
      },
    );
  }

  async generatePDF(@Req() _req: any, @Res() res: any, body: any) {
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 0,
      args: [
        // '--disable-setuid-sandbox',
        // '--single-process',
        // '--no-zygote',
        '--no-sandbox',
        '--disable-gpu',
      ],
      executablePath:
        this.configService.get('NODE_ENV') === 'production'
          ? '/usr/bin/chromium-browser'
          : JSON.parse(this.configService.get('APP_DOCKERIZED')) === true
          ? '/usr/bin/chromium-browser'
          : puppeteer.executablePath(),
    });
    this.logger.log('Generating PDF');

    try {
      const emails = body.emails || [];
      // const { logo, invoice, cartItems, userName } = data;

      // Launch a headless browser using Puppeteer
      const page = await browser.newPage();

      // Generate HTML content for the PDF using a service method
      const finalHtml = body.template ? body.template : '';
      await page.setContent(finalHtml, { waitUntil: 'load' });

      // Generate the PDF as a Buffer
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

      await browser.close();

      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const mail: SendEmailInterface = {
          html: { template: `This is a trial email` },
          recipient: email,
          textAlignment: 'left',
          hasHero: false,
          subject: `Auto generated pdf file attachment`,
          attachments: [
            {
              content: pdfBuffer,
              filename: 'Invoice',
              contentType: 'application/pdf',
            },
          ],
        };
        await this.notificationsService.dispatchEmail(mail);
      }

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf');

      // Stream the PDF buffer back to the client
      const pdfStream = new Readable();
      pdfStream.push(pdfBuffer);
      pdfStream.push(null); // Signal the end of the stream

      pdfStream.pipe(res);
    } catch (e) {
      this.logger.error(e);
      res.send(`Something went wrong while running Puppeteer: ${e}`);
    } finally {
      await browser.close();
    }
  }
  /**
   * Initiate Database Sync
   *
   * @param {string} userId
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AppService
   */
  async syncDatabase(userId: string): Promise<CustomHttpResponse> {
    this.eventEmitter.emit(SystemEventsEnum.SyncDatabase, userId);
    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'Database Sync initiated successfully!',
      null,
    );
  }

  syncSystem(userId: string): CustomHttpResponse {
    this.eventEmitter.emit(SystemEventsEnum.Sync, userId);
    this.eventEmitter.emit(SystemEventsEnum.SyncDatabase, userId);

    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'Database Sync initiated successfully!',
      null,
    );
  }

  async sendNewRelease(body: ReleasesDto): Promise<CustomHttpResponse> {
    await this.eventEmitter.emit(SystemEventsEnum.SendNewVersionOut, body);
    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'New version notification sent out',
      null,
    );
  }
}
