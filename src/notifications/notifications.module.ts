import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { HttpModule } from '@nestjs/axios';
import { TestNotificationsController } from './controllers/test-notifications.controller';
import { MailService } from './services/mail/mail.service';
import { WhatsappService } from './services/whatsapp.service';
import { OnfonService } from './services/sms/onfon.service';
import { SmsWebhookController } from './controllers/sms-webhook.controller';
import { SmsService } from './services/sms/sms.service';

@Global()
@Module({
  controllers: [TestNotificationsController, SmsWebhookController],
  imports: [HttpModule],
  providers: [
    NotificationsService,
    MailService,
    SmsService,
    WhatsappService,
    OnfonService,
  ],
  exports: [NotificationsService, MailService, SmsService, WhatsappService],
})
export class NotificationsModule {
  //
}
