import { NotificationTypeEnum } from '../enums/notification.enum';
import { NotificationSubScriptions } from '../interfaces/notification-subscription.interface';

export const DefaultNotificationSubscriptions: NotificationSubScriptions[] = [
  {
    notification: NotificationTypeEnum.INVOICES,
    channels: {
      sms: false,
      email: true,
      whatsapp: false,
    },
  },
  {
    notification: NotificationTypeEnum.RECEIPTS,
    channels: {
      sms: false,
      email: true,
      whatsapp: false,
    },
  },
  {
    notification: NotificationTypeEnum.TASKS,
    channels: {
      sms: true,
      email: true,
      whatsapp: true,
    },
  },
];
