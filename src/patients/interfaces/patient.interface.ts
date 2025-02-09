export interface CreatePatient {
  patientName: string;
  phone: string;
  dateOfBirth: string;
  gender: GenderType;
  email?: string;
  zipCode: string;
  street: string;
  town: string;
  country: string;
}

export enum GenderType {
  M = 'M',
  F = 'F',
}

interface BillingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Patient extends CreatePatient {
  _id: string;
  uniqueId: number;
  patientName: string;
  email?: string;
  KRA_PIN?: string;
  idNumber?: string | null;
  serial: string;
  patientManager?: string | null;
  phone: string;
  dateOfBirth: string; // ISO format (YYYY-MM-DD)
  age: number; // ISO format (YYYY-MM-DD)
  gender: GenderType;
  billingAddress: BillingAddress;

  verified: boolean;
  group?: string;
  address?: string;
  currentBalance: number;
  openingBalance: number;
  isActive: boolean;

  createdBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface UpdatePatient extends Patient {}
