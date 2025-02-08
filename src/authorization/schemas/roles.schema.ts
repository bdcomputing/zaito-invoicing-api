import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { DashboardEnums } from 'src/shared/enums/dashboard.enum';

export const RolesSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  description: { type: String, required: false, trim: true },
  permissions: { type: Array, required: true, default: [], trim: true },
  dashboard: {
    type: String,
    required: true,
    default: DashboardEnums.CLIENT,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
    trim: true,
  },
  uniqueId: {
    type: Number,
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

export const Role = mongoose.model(DatabaseModelEnums.ROLE_MODEL, RolesSchema);
