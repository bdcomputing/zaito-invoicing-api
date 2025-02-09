export interface InvoicePayment {
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

  // Insurance related
  claimCode: string;
  principalMember: string;
  relationship: string;
  coverNumber: string;
  department: string;
}
