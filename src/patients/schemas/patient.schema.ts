import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { PlainBaseSchema } from 'src/database/schemas/base.schema';

export const PatientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true,
  },
  serial: {
    type: String,
    required: false,
    trim: true,
    unique: true,
    sparse: true,
  },
  currentBalance: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },

  openingBalance: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },

  phone: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  KRA_PIN: {
    type: String,
    required: false,
    trim: true,
    unique: true,
    sparse: true,
    uppercase: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
    trim: true,
  },
  idNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    columns: ['idNumber'],
  },
  isActive: {
    type: Boolean,
    required: true,
    trim: true,
    default: true,
  },
  shippingAddress: {
    type: String,
    required: false,
    trim: true,
  },
  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const Patient = mongoose.model(
  DatabaseModelEnums.PATIENT_MODEL,
  PatientSchema,
);
