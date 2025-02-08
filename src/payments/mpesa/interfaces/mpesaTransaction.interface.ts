export interface MpesaTransactionData {
  merchantRequestID: string;
  checkoutRequestID: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: Date;
  phoneNumber?: string;
  isUsed: boolean;
  patientName?: string;
  _id?: string;
  isDirectPayment?: boolean;
}
