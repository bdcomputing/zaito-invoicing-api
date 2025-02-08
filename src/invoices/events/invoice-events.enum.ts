export enum InvoiceEvents {
  // Remittance
  PaymentRemittanceCreated = 'PaymentRemittanceCreated',
  PaymentRemittanceUpdated = 'PaymentRemittanceUpdated',
  // Allocation
  PaymentCreated = 'PaymentCreated',
  PaymentUpdated = 'PaymentUpdated',
  AllocationReceiptCreated = 'AllocationReceiptCreated',
  AllocationReceiptUpdated = 'AllocationReceiptUpdated',
  AllocationReceiptDeleted = 'AllocationReceiptDeleted',
  AllocationReceiptApproved = 'AllocationReceiptApproved',
  AllocationReceiptRejected = 'AllocationReceiptRejected',
  AllocationReceiptCancelled = 'AllocationReceiptCancelled',
  AllocationReceiptReversed = 'AllocationReceiptReversed',

  // Invoice Note Payment
  InvoicePaymentCreated = 'InvoicePaymentCreated',
  InvoicePaymentUpdated = 'InvoicePaymentUpdated',

  // Receipts
  InsurerPremiumReceiptUploaded = 'InsurerPremiumReceiptUploaded',

  // Invoice note paid
  InvoicePaymentEntryMade = 'InvoicePaymentEntryMade',
  UpdatePremiumPaymentOnInvoiceUpdated = 'UpdatePremiumPaymentOnInvoiceUpdated',
}
