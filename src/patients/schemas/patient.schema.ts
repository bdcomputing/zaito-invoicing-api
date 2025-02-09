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
    required: false,
    lowercase: true,
    trim: true,
    unique: false,
    sparse: true,
    columns: ['email'],
  },

  phone: {
    type: String,
    required: false,
    trim: true,
    unique: false,
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
  age: {
    type: Number,
    required: true,
    default: 0,
    trim: true,
  },
  idNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    columns: ['idNumber'],
  },

  dateOfBirth: {
    type: String,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },

  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  town: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  // Extend Base Schema
  ...PlainBaseSchema.obj,
});

export const Patient = mongoose.model(
  DatabaseModelEnums.PATIENT_MODEL,
  PatientSchema,
);
