export interface InvoiceItemInterface {
  _id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  price: number;

  createdBy: string;
  createdAt: Date;

  updatedBy?: string;
  updatedAt?: Date;

  deletedBy?: string;
  deletedAt?: Date;
}
