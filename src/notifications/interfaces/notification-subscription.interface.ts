import { NotificationTypeEnum } from '../enums/notification.enum';

export interface NotificationSubScriptionsInterface {
  notification: NotificationTypeEnum;
  channels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
}
