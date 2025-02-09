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

  // Insurance related
  claimCode: string;
  principalMember: string;
  relationship: string;
  coverNumber: string;
  department: string;

  createdBy: string;
  createdAt: Date;

  updatedBy?: string;
  updatedAt?: Date;

  deletedBy?: string;
  deletedAt?: Date;
}
