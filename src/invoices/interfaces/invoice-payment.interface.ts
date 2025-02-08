export interface InvoicePaymentInterface {
  _id: string;
  receiptId: string;
  narration: string;
  clientId: string;
  invoiceId: string;
  riskNoteId: string;
  paidAmount: number;
  balance: number;
  creditAmount: number;
  serial: string;
  createdAt: Date;
  createdBy: string;
  paymentChannel: string;
}
