export interface MpesaPayment {
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TransactionType: string;
  TransID: string;
  TransTime: string;
  BusinessShortCode: string;
  BillRefNumber: string;
  InvoiceNumber: string;
  ThirdPartyTransID: string;
  MSISDN: string;
  TransAmount: number;
  OrgAccountBalance: number;
}
