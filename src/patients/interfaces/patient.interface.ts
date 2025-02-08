export interface PatientInterface {
  _id: string;
  uniqueId?: number;
  patientName: string;
  email: string;
  KRA_PIN?: string;
  idNumber?: string | null;
  serial: string;
  patientManager?: string | null;
  phone: string;
  verified: boolean;
  group?: string;
  address?: string;
  currentBalance: number;
  openingBalance: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}
