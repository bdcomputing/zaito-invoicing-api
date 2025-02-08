import { QueuesEnum } from '../enums/queues.enum';

export const queuesRegister: { name: string }[] = [
  {
    name: QueuesEnum.SYNC_CLIENT_STATEMENT,
  },
  {
    name: QueuesEnum.SYNC_INVOICES,
  },

  {
    name: QueuesEnum.SEND_EMAIL_ON_TASK_CREATED,
  },
  {
    name: QueuesEnum.SEND_EMAIL_ON_TASK_OVERDUE,
  },
  {
    name: QueuesEnum.GENERATE_PRODUCTS,
  },
  {
    name: QueuesEnum.GENERATE_PRODUCT,
  },
  {
    name: QueuesEnum.GENERATE_ORDER_INVOICE,
  },
  {
    name: QueuesEnum.GENERATE_ORDER_SERIAL,
  },
];
