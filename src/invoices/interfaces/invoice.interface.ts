import { PatientInterface } from 'src/patients/interfaces/patient.interface';

export interface InvoiceInterface {
  _id: string;
  uniqueId: string;
  serial: string;
  clientId: string;
  narration: string;
  client?: PatientInterface;
  vatAmount: number;
  vatRate: number;
  subTotal: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  createdBy: string;
  createdAt: Date;

  updatedBy?: string;
  updatedAt?: Date;

  deletedBy?: string;
  deletedAt?: Date;
}
