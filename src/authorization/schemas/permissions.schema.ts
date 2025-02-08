import mongoose from 'mongoose';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';

export const PermissionsSchema = new mongoose.Schema({
  permission: { type: String, required: true, trim: true },
});

export const Permission = mongoose.model(
  DatabaseModelEnums.PERMISSION_MODEL,
  PermissionsSchema,
);
