import mongoose from 'mongoose';
import { generatePasswordResetCode } from 'src/auth/utils/auto-generate-password-reset-code';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  // email
  email: { type: String, required: true, trim: true, unique: true },
  emailVerified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },

  magicLogin: {
    required: true,
    type: Boolean,
    default: true,
    trim: true,
  },

  // phone
  phone: { type: String, required: true, trim: true, unique: true },
  phoneVerified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },
  profileImageUrl: { type: String, required: false, trim: true },
  verified: {
    required: true,
    type: Boolean,
    default: false,
    trim: true,
  },
  // account types
  isBackOfficeUser: {
    type: Boolean,
    required: true,
    trim: true,
    default: false,
  },
  patientId: { required: false, type: String, trim: true, default: null },
  clinicId: { required: false, type: String, trim: true, default: null },
  defaultShippingAddress: {
    required: false,
    type: String,
    trim: true,
    default: null,
  },

  notifications: {
    type: Object,
    required: false,
    trim: true,
  },
  passwordResetCode: {
    required: true,
    type: String,
    default: generatePasswordResetCode(),
    trim: true,
    sparse: true,
  },
  password: { type: String, required: true, trim: true },

  isActive: { type: Boolean, required: true, default: true, trim: true },

  isPasswordDefault: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  resetPasswordToken: {
    type: String,
    required: false,
    default: null,
  },
  otpId: { type: String, required: false, trim: true },

  role: {
    type: String,
    required: false,
    trim: true,
  },
  signature: {
    type: Object,
    required: false,
    trim: true,
  },
  createdBy: {
    type: String,
    required: false,
    trim: true,
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true,
  },
  deletedBy: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
    trim: true,
  },
  lastPasswordChange: {
    type: Date,
    required: true,
    default: new Date(),
    trim: true,
  },
  updatedAt: {
    type: Date,
    required: false,
    trim: true,
  },
  deletedAt: {
    type: Date,
    required: false,
    trim: true,
  },
});

export const User = mongoose.model(DatabaseModelEnums.USER_MODEL, UserSchema);
