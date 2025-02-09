import { Patient } from 'src/patients/interfaces/patient.interface';

export interface Invoice {
  _id: string;
  uniqueId: string;
  serial: string;
  clientId: string;
  narration: string;
  client?: Patient;
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
