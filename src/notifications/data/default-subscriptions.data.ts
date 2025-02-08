import { NotificationTypeEnum } from '../enums/notification.enum';
import { NotificationSubScriptionsInterface } from '../interfaces/notification-subscription.interface';

export const DefaultNotificationSubscriptions: NotificationSubScriptionsInterface[] =
  [
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
