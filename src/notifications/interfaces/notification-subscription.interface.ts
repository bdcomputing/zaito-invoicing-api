import { NotificationTypeEnum } from '../enums/notification.enum';

export interface NotificationSubScriptions {
  notification: NotificationTypeEnum;
  channels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
}
