export enum QueuesEnum {
  SYNC_CLIENT_STATEMENT = 'sync-client-balances',
  SYNC_INVOICES = 'sync-invoices',
  SEND_EMAIL_ON_TASK_CREATED = 'send-email-on-new-task-created',
  SEND_EMAIL_ON_TASK_OVERDUE = 'send-email-on-task-overdue',
  REMOVE_UNKNOWN_INVOICES = 'remove-unknown-invoices',
  REMOVE_UNKNOWN_INVOICE = 'remove-unknown-invoice',

  // PRODUCT DEMO
  GENERATE_PRODUCTS = 'generate-products',
  GENERATE_PRODUCT = 'generate-product',

  // Orders
  GENERATE_ORDER_INVOICE = 'generate-order-invoice',
  GENERATE_ORDER_SERIAL = 'generate-order-serial',
}
