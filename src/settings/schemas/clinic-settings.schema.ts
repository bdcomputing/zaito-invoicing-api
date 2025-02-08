import * as mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const ClinicSettingsSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    trim: true,
  },
  isMailCredentialsDefault: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  mail: {
    port: { type: Number, required: false, default: 465, trim: true },
    auth: {
      user: { type: String, required: false, trim: true },
      pass: { type: String, required: false, trim: true },
    },
    host: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
  },
  branding: {
    logo: { type: String, required: false, trim: true, default: null },
    logoFile: { type: Object, required: false, trim: true, default: null },
    darkLogo: { type: String, required: false, trim: true, default: null },
    favicon: { type: String, required: false, trim: true, default: null },
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

export const Settings = mongoose.model(
  DatabaseModelEnums.CLINIC_SETTING_MODEL,
  ClinicSettingsSchema,
);
