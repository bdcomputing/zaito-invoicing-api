import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { FacebookApp } from 'src/settings/interfaces/settings.interface';

@Injectable()
export class WhatsappService {
  private logger = new Logger(WhatsappService.name);

  sendMessage(data: any, settings: FacebookApp) {
    const config = {
      method: 'post',
      url: `https://graph.facebook.com/${settings.FACEBOOK_VERSION}/${settings.FACEBOOK_PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${settings.FACEBOOK_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    this.logger.log(settings);

    return axios(config);
  }

  getTextMessageInput(recipient, text) {
    return JSON.stringify({
      messaging_product: 'whatsapp',
      preview_url: false,
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        body: text,
      },
    });
  }
}
